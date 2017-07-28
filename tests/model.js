const { chai, should, Srv, MongoClient, Body } = require('./bootstrap')
const { Route } = require('../lib/model')

describe('App:model', () => {

  const name = 'one'
  const route = '/one'
  const regex = /^\/one\/\w+$/
  const App = new Srv

  let DB,model,app,id,routeId

  it('should get all docs in collection', async () => {

    DB = await MongoClient.connect('mongodb://localhost:27017/test')
    model = await Route(DB, name)

    App.get(route, model.list)
    App.get(regex, model.find)
    App.del(regex, model.remove)
    App.post(Body)
    App.post(route, model.create)

    app=App.init()

    const res = await chai.request(app).get(route)
    common(res, 'array')
  })

  it('should create new doc', async () => {
    const res = await chai.request(app).post(route).send({ a: 1, b: 2 })
    common(res, 'object')
    id = res.body.result._id
    routeId = route + '/' + id
  })

  it('should find doc by id', async () => {
    const res = await chai.request(app).get(routeId)
    common(res, 'object')
    res.body.result._id.should.be.eql(id)
  })

  it('should delete doc by id', async () => {
    const res = await chai.request(app).del(routeId)
    common(res, 'object')
  })

  it('delete doc should not exist', async () => {
    const res = await chai.request(app).get(routeId)
    common(res)
    res.body.ok.should.be.eql(true);
  })

})

function common(res, type, code=200) {
  res.should.be.json;
  res.should.have.status(code);

  if (type)
    res.body.result.should.be.an(type);
  else
    should.not.exist(res.body.result)
}