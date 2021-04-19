"use strict"
const express = require('express');
const apiv1 = express.Router();
const request = require('./post_twitter')
const searchResultAbstractor = require('../dynamic_abstractor/search_abstractor')

apiv1.post(`/search`, async(req, res, next) =>{
    try {
        const options = {
            hostname: 'api.twitter.com',
            path: `/1.1/search/tweets.json?q=${req.body.query}&result_type=popular`,
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.API_BEARER_TOKEN}`
            }
          }
        const payload = await request(options)
        
        const result = await Promise.all(payload.statuses.map(async el =>{
            return await searchResultAbstractor(el)
        })) || []
        const hashtags = await Promise.all(result.filter(el => el.hashtags.length > 0 ? el.hashtags : null).map(el => el.hashtags).reduce((acc, next) => acc.concat(next))) || [];
        return res.json({ result, hashtags, next_results: payload.search_metadata.next_results })
    } catch (error) {
        next(error)
    }
})
apiv1.post('/next-results', async(req, res, next) =>{
    console.log(req.body)
    try {
        const options = {
            hostname: 'api.twitter.com',
            path: `/1.1/search/tweets.json?${req.body.next_results}`,
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.API_BEARER_TOKEN}`
            }
          }
          const payload = await request(options);
          console.log(payload)
          const result = await Promise.all(payload.statuses.map(async el =>{
            return await searchResultAbstractor(el)
        })) || []
        const hashtags = await Promise.all(result.filter(el => el.hashtags.length > 0 ? el.hashtags : null).map(el => el.hashtags).reduce((acc, next) => acc.concat(next))) || [];
        return res.json({ result, hashtags, next_results: payload.search_metadata.next_results })
    } catch (error) {
        
    }
})

module.exports = apiv1