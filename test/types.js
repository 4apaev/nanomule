describe('App:types', () => {
  const App = new Mule;
  const payload = { a:1,b:2,c:3 }

  App.post(ReqBody)

  App.get('/json/ok', ctx => {
    ctx.json(200, payload)
  })

  App.get('/json/err', ctx => {
    ctx.json(400, payload)
  })

  const app = chai.request(App.init())

  it('should use ctx.json with code 200', done => {
    app.get('/json/ok').end((err, res) => {
      res.should.be.json;
      res.should.have.status(200);
      res.body.should.be.eql(payload);
      done();
    })
  })

  it('should use ctx.json with code 400', done => {
    app.get('/json/err').end((err, res) => {
      res.should.be.json;
      res.should.have.status(400);
      res.body.should.be.eql(payload);
      done();
    })
  })

})