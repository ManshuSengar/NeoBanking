const express = require('express');
const router = express.Router();
const sqlQuery = require('../globalfunction/sql');
const pool = require('../util/connection');
const fetch = require('node-fetch');
const { json } = require('express');
const moment = require('moment-timezone');
const db = require('../util/db')

moment().tz("Asia/Calcutta").format();
process.env.TZ = 'Asia/Calcutta';
var date = moment().format('DD-MM-YYYY');
var time = moment().format('hh:mm:ss');
var year = moment().format('YYYY');
var month = moment().format('MM');

router.post('/pincodedata', (req, res) => {
    var apikey = req.headers.apikey;
    var {pincode} = req.body;
    if(!pincode || pincode.length < 6 || pincode.length > 6){
        return res.status(422).json({ status:"fail", message: "Please provide 6 digit pincode" })
    }

    pool().getConnection(async function(err, connection) {
        if (err) {
            connection.release();
            return res.status(422).json({ status: "fail", error: err })
        }

        const sql = 'SELECT * FROM territory WHERE territory.pincode = ? AND territory.apikey= ? ';
        const value = [pincode,apikey];
        await sqlQuery(connection, sql, value).then(async(territory) => {
            if(territory.length === 0){
                info = {
                    city        : "",
                    districtid  : "",
                    dist        : "",
                    stateid     : "",
                    state       : "",
                    pincode     : "",
                }
                return res.status(404).json({status:"fail", message:"No Are found from this pincode", data:info})
            } else {
                console.log('territory', territory)
                const infodata = territory.map(async(item, index) => {
                    var territorylistarr = []
                    var territorylist = item.territory_name.split(',');
                    territorylist.map((values, index) => {
                        territoryinfo = {
                            cityname : values
                        }
                        territorylistarr.push(territoryinfo)
                    })
                    console.log('Territorylist', territorylist)
                    const sql2 = 'SELECT state_name FROM state WHERE state_id = ?';
                    const value2 = [item.state_id]
                    console.log('state_id', item.state_id)
                    await sqlQuery(connection, sql2, value2).then(async (statename) => {
                        console.log('statename', statename)
                        var state = statename[0].state_name
                        var sql3 = 'SELECT district_name FROM district WHERE id = ?';
                        console.log('district_id', item.district_id)
                        var value3 = [item.district_id]
                        await sqlQuery(connection, sql3, value3).then(async(districtname) => {
                            console.log('district', districtname)
                            if (districtname.length === 0) {
                                const info = {
                                    city        : territorylistarr,
                                    districtid  : item.district_id,
                                    stateid     : item.state_id,
                                    state       : state,
                                    pincode     : item.pincode,
                                }
                                return res.json(info)
                            } else {
                                var district = districtname[0].district_name
                            const info = {
                                city        : territorylistarr,
                                districtid  : item.district_id,
                                dist        : district,
                                stateid     : item.state_id,
                                state       : state,
                                pincode     : item.pincode,
                            }
                            return res.json(info)
                            }
                        }).catch((err) => {
                            console.log('error', err)
                            return res.status(422).json({ status: "fail", error: err })
                        })
                    }).catch((err) => {
                        console.log('error', err)
                        return res.status(422).json({ status: "fail", error: err })
                    })
                })
            }
        }).catch((err) => {
            console.log('error', err)
            return res.status(422).json({ status: "fail", error: err })
        }).finally(() => {
            connection.release();
        })
    })
});


router.get('/ifsccode/:ifsc', (req, res) => {
    var apikey = req.headers.apikey
    var usertype = req.headers.usertype
    if(!apikey || !usertype){
      return res.status(400).json({status:"fail",message: "Please Provide API Key"})
    }
      var ifsc = req.params.ifsc
      db.query(`SELECT * FROM keysapi WHERE keysapi.${usertype} = '${apikey}'`)
      .then(([fetchedkey]) => {
          if(!fetchedkey[0]) {
              return res.status(422).json({error: "INVALID API KEY"})
          }
          let url = 'https://ifsc.razorpay.com/'+ifsc
          let settings = { method: "GET" };
          fetch(url, settings).then(res => res.json())
          .then((statdata) => {
              if(!statdata.BRANCH){
                  return res.status(400).json({status:"fail",message: "Please Provide valid IFSC Code"})
              }
              res.json(statdata)
          })
          .catch((err) => {
              console.log('Error fetching IFSC data', err)
          })
      })
      .catch((err) => {
          console.log('Error in api', err)
      })
  });

module.exports = router;
