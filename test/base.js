describe('App:base', () => {
  const App = new Mule;

  App.post(ReqBody)

  App.get('/', ctx => {
    ctx.code = 200
    ctx.type = 'html'
    ctx.body = '<h1>Hallo</h1>'
  })
  App.get('/query', ctx => {
    ctx.code = 200
    ctx.type = 'json'
    ctx.body = ctx.query
  })
  App.get('/json', ctx => {
    ctx.code = 200
    ctx.type = 'json'
    ctx.body = { hallo: true }
  })
  App.post('/json', ctx => {
    ctx.code = 200
    ctx.type = 'json'
    const { payload } = ctx
    payload.olo = true
    ctx.body = payload
  })

  App.get('/fail', ctx => {
    throw new Error('Epic Fail')
  });


  const app = chai.request(App.init())

  it('should get html', done => {
    app.get('/').end((err, res) => {
      res.should.be.html;
      res.should.have.status(200);
      done();
    })
  })

  it('should parse url query params', done => {
    let q = { a: '1', b: '2' };
    app.get('/query').query(q).end((err, res) => {
      res.should.be.json;
      res.should.have.status(200);
      res.body.should.be.eql(q);
      done();
    })
  })

  it('should get json', done => {
    app.get('/json').end((err, res) => {
      res.should.be.json;
      res.should.have.status(200);
      res.body.should.be.eql({ hallo: true });
      done();
    })
  })

  it('should post json data', done => {
    app.post('/json').send({ a: 1, b: 2 }).end((err, res) => {
      res.should.be.json;
      res.should.have.status(200);
      res.body.should.be.eql({ a: 1, b: 2, olo: true });
      done();
    })
  })

  it('should fail post json data', done => {
    app.post('/json').type('json').send('{ a:1, b:2 }').end((err, res) => {
      res.should.be.json;
      res.should.have.status(400);
      res.body.ok.should.be.eql(false);
      done();
    })
  })

  it('should fail', done => {
    app.get('/fail').end((err, res) => {
      res.should.be.json;
      res.should.have.status(500);
      res.body.ok.should.be.eql(false);
      res.body.message.should.be.eql('Epic Fail');
      done();
    })
  })
})