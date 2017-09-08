const { log } = console

describe('App:params', () => {
  const App = new Mule;
  const getParams = ctx => {
    ctx.code = 200
    ctx.type = 'json'
    ctx.body = ctx.params
  }

  App.get('/a/:id', getParams)
  App.get('/b/:type/:name', getParams)

  const app = App.init()

  it('should match route parameters', done => {
    chai.request(app).get('/a/uid123').end((err, res) => {
      res.should.be.json
      res.should.have.status(200)
      res.body.should.be.an('object')
      res.body.should.be.eql({ id: 'uid123' })
      done()
    })
  })

  it('should match multiple route parameters', done => {
    chai.request(app).get('/b/doggo/shoshi').end((err, res) => {
      res.should.be.json
      res.should.have.status(200)
      res.body.should.be.an('object')
      res.body.should.be.eql({ type: 'doggo', name: 'shoshi' })
      done()
    })
  })
})