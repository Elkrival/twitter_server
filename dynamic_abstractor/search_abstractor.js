module.exports = async function searchResultAbstractor(result) {
    return {
       text: result.text,
       hashtags: result.entities.hashtags.map(el => el.text),
       user_mentions: result.entities.user_mentions && result.entities.user_mentions.length > 0 ? await Promise.all(result.entities.user_mentions.map(el =>{
           return {
               screen_name: el.screen_name,
           }
       })): [],
       media: result.entities.media && result.entities.media.length > 0 ? await Promise.all(result.entities.media.map(el => {
           return {
            url_https: el.media_url_https,
            type: el.photo
           }
       })) : [],
       profile_image_url: result.user.profile_image_url_https,
       name: result.user.name,
       screen_name: result.user.screen_name,
       url: result.url ? url : ''
    }
}