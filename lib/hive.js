const moment = require('moment')
const axios = require('axios')
const mongodb = require('./mongodb')

const tablePlanZoop = 'zoop_plans'
const tableSignatureZoop = 'zoop_signature'

async function hivePlanNow (body, token) {
  const value = body.planToHive.valueHive * 100
  const auth = {
    username: global.publishableKey,
    password: ''
  }
  await mongodb.connect()
  var plan = await mongodb(tablePlanZoop).findOne({ amount: value })
  if (!plan || !plan._id) {
    const responsePlan = await axios({
      url: `https://api.zoop.ws/v2/marketplaces/${global.marketplaceId}/plans`,
      method: 'post',
      data: {
        frequency: 'monthly',
        interval: 1,
        payment_methods: ['credit'],
        currency: 'BRL',
        name: body.planToHive.name + ' - R$ ' + body.planToHive.valueHive,
        amount: value,
        grace_period: 30,
        tolerance_period: 15
      },
      auth: auth
    })
    if (responsePlan && responsePlan.data) {
      await mongodb(tablePlanZoop).insert(responsePlan.data)
      plan = responsePlan.data
    } else {
      return true
    }
  }
  const responseSub = await axios({
    url: `https://api.zoop.ws/v2/marketplaces/${global.marketplaceId}/subscriptions`,
    method: 'post',
    data: {
      plan: plan.id,
      on_behalf_of: global.sellerId,
      customer: token.buyer.id,
      currency: 'BRL',
      due_date: moment().add(30, 'days').format('YYYY-MM-DD')
    },
    auth: auth
  })
  await mongodb(tableSignatureZoop).insert(responseSub.data)
  return true
}

module.exports = {
  hivePlanNow
}
