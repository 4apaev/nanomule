describe('App:errors', () => {

  const App = new Mule;
  App.post(ReqBody)


  App.get('/fail', ctx => {
    ctx.code = 200
    throw new Error('Epic Fail')
  });

  App.get('/401', ctx => ctx.throws(401, '401'));
  App.get('/402', ctx => ctx.throws(402));
  App.get('/500', ctx => ctx.throws(new Error));
  App.get('/fail', ctx => Promise.reject(ctx.throws));


  App.post('/json', ctx => {
    ctx.code = 200
    ctx.type = 'json'
    payload.olo = true
    ctx.body = { ok:true }
  })


  const app = chai.request(App.init())


  it('should fail', done => {
    app.get('/fail').end((err, res) => {
      res.should.be.json;
      res.should.have.status(500);
      res.body.ok.should.be.eql(false);
      res.body.message.should.be.eql('Epic Fail');
      done();
    })
  })

  it('should fail parse req body', done => {
    app.post('/json').type('json').send('{ ssd }').end((err, res) => {
      res.should.be.json;
      res.should.have.status(400);
      res.body.name.should.be.eql('SyntaxError');
      done();
    })
  })


  it('should throw 401', done => {
    app.get('/401').end((err, res) => {
      res.should.be.json;
      res.should.have.status(401);
      res.body.message.should.be.eql('401');
      done();
    })
  })

  it('should throw 402', done => {
    app.get('/402').end((err, res) => {
      res.should.be.json;
      res.should.have.status(402);
      done();
    })
  })

  it('should throw 500', done => {
    app.get('/500').end((err, res) => {
      res.should.be.json;
      res.should.have.status(500);
      done();
    })
  })

  it('should throw', done => {
    app.get('/fail').end((err, res) => {
      res.should.be.json;
      res.should.have.status(500);
      log(res.body)
      done();
    })
  })

})
