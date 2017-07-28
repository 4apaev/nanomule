const { chai, should, Srv } = require('./bootstrap')



describe('App:use', () => {

  it('should compose middleware', done => {
    const App = new Srv
    const calls = [];

    App.use((ctx, next) => {
      calls.push(1);
      return next().then(() => {
        calls.push(6);
      });
    });

    App.use((ctx, next) => {
      calls.push(2);
      return next().then(() => {
        calls.push(5);
      });
    });

    App.use((ctx, next) => {
      calls.push(3);
      return next().then(() => {
        calls.push(4);
      });
    });

    const app = App.init()

    chai.request(app).get('/').end((err, res) => {
        res.should.have.status(404);
        calls.should.be.eql([1, 2, 3, 4, 5, 6]);
        done();
      })
  });

})