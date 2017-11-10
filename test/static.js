const statiq = require('../lib/static')

describe('App:static', () => {
  const app = chai.request(new Mule().use(statiq()).init())
  it('should get file', done => {
    app.get('/package.json').buffer(true).end((e, r) => {
      r.should.be.json;
      r.should.have.status(200);
      done();
    })
  })

  it('should get markdown', done => {
    app.get('/readme.md').buffer(true).end((e, r) => {
      r.type.should.be.eq('text/x-markdown')
      r.should.have.status(200);
      done();
    })
  })

  it('should return 404 directory', done => {
    app.get('/').buffer(true).end((e, r) => {
      r.should.have.status(404);
      done();
    })
  })

  it('should return 404 file', done => {
    app.get('/missing.txt').buffer(true).end((e, r) => {
      r.should.have.status(404);
      done();
    })
  })
})