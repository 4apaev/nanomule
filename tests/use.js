describe('App:use', () => {

  it('should compose middleware', async () => {
    const calls = [];
    const App = new Mule

    App.use(async (ctx, next) => {
        calls.push(1)
        await next()
        calls.push(6)
      })
      .use(async (ctx, next) => {
        calls.push(2)
        await next()
        calls.push(5)
      })
      .use(async (ctx, next) => {
        ctx.code = 200
        calls.push(3)
        await next()
        calls.push(4)
      })

    const res = await chai.request(App.init()).get('/')
    res.should.have.status(200);
    calls.should.be.eql([ 1, 2, 3, 4, 5, 6 ]);
  })

})