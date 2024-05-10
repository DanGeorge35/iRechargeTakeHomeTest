import { expect } from 'chai'
import chaiHttp from 'chai-http'
import sinon from 'sinon'

import UsersEndpoint from '../../src/services/users/users.endpoint'

chai.use(chaiHttp)

describe('Users Endpoint', () => {
  beforeEach(() => {
    // Mock any dependencies or middleware if needed
  })

  it('should handle user login', async () => {
    const req = { body: { /* Provide login credentials */ } }
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    }

    await UsersEndpoint[0].handler[0](req, res)

    expect(res.status.calledWith(200)).to.be.true
    expect(res.json.calledOnce).to.be.true
    // Add more assertions as needed
  })

  it('should create a new user', async () => {
    const req = { body: { /* Provide user data */ } }
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    }

    await UsersEndpoint[1].handler[0](req, res)

    expect(res.status.calledWith(200)).to.be.true
    expect(res.json.calledOnce).to.be.true
    // Add more assertions as needed
  })

  // Add more tests for other endpoints similarly
})
