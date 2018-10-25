const axios = require('axios')

global.marketplaceId = '8bb32c83890046a5a64912785a24f6fd'
global.publishableKey = 'zpk_prod_gIqgityokbDsCvqYBAB4iidM'
global.sellerId = '78ab951dc6cb4a1e94cef9caaad511c0'

const auth = {
  username: global.publishableKey,
  password: ''
}

const getTransactionByCustomer = async (token, value) => {
  return axios({
    url: `https://api.zoop.ws/v1/marketplaces/${global.marketplaceId}/transactions`,
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      amount: value * 100,
      currency: 'BRL',
      description: 'venda',
      on_behalf_of: global.sellerId,
      customer: token,
      payment_type: 'credit',
      installment_plan: {
        mode: 'interest_free',
        number_installments: 1
      }
    },
    auth: auth
  })
}

const getTransactionByToken = async (token, value) => {
  return axios({
    url: `https://api.zoop.ws/v1/marketplaces/${global.marketplaceId}/transactions`,
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      amount: value * 100,
      currency: 'BRL',
      description: 'venda',
      on_behalf_of: global.sellerId,
      token: token,
      payment_type: 'credit',
      installment_plan: {
        mode: 'interest_free',
        number_installments: 1
      }
    },
    auth: auth
  })
}

module.exports = {
  getTransactionByCustomer,
  getTransactionByToken
}
