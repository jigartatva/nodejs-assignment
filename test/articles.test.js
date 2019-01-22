process.env.NODE_ENV = 'test';
process.env.DEBUG = '';

// Require the dev-dependencies
const firebase = require('firebase');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');

const should = chai.should();

chai.use(chaiHttp);

const postArticleContentFailer = {
  nickname: 'Tester',
  title: 'Article for test',
  content: '',
  creationDate: '2019-01-22 10:10:10'
};

const postArticleSuccess = {
  nickname: 'Tester',
  title: 'Article for test',
  content: `Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua.Ut enim ad minim veniam,
        quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
consequat.Duis aute irure dolor in reprehenderit in voluptate velit esse
cillum dolore eu fugiat nulla pariatur.Excepteur sint occaecat cupidatat non
proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
  creationDate: '2019-01-22 10:10:10'
};

const postArticleSuccessForGetReq = {
  nickname: 'Tester',
  title: 'Article for test',
  content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod.',
  creationDate: '2019-01-22 10:10:10'
};

describe('Articles', () => {
  // Ensure DB connection & empty DB
  before(done => {
    const testConnect = firebase.database().ref('.info/connected');
    testConnect.on('value', snap => {
      if (snap.val() === true) {
        const firebaseDB = firebase.database();

        firebaseDB
          .ref('test')
          .remove()
          .then(() => {
            done();
          });
      }
    });
  });

  describe('GET /articles', () => {
    it('it should return empty array of data', done => {
      chai
        .request(server)
        .get('/articles')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.code.should.be.eql(204);
          res.body.data.should.be.a('array');
          res.body.data.length.should.be.eql(0);
          done();
        });
    });
  });

  describe('POST /articles', () => {
    it('it should not add article without content', done => {
      chai
        .request(server)
        .post('/articles')
        .send(postArticleContentFailer)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.code.should.be.eql(422);
          res.body.should.have.property('errors');
          res.body.errors.length.should.be.eql(1);
          done();
        });
    });

    it('it should add the article ', done => {
      chai
        .request(server)
        .post('/articles')
        .send(postArticleSuccess)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.code.should.be.eql(201);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Article saved successfully!');
          res.body.data.should.have.property('id');
          done();
        });
    });
  });

  describe('GET /articles', () => {
    it('it should list all articles', done => {
      chai
        .request(server)
        .get('/articles')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.code.should.be.eql(200);
          res.body.data.should.be.a('array');
          done();
        });
    });
  });

  describe('GET /articles/:id', () => {
    it('it should get an article by the given id', done => {
      chai
        .request(server)
        .post('/articles')
        .send(postArticleSuccessForGetReq)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.code.should.be.eql(201);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Article saved successfully!');
          res.body.data.should.have.property('id');

          const articleID = res.body.data.id;

          chai
            .request(server)
            .get(`/articles/${articleID}`)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');

              res.body.data.should.have.property('id');
              res.body.data.should.have.property('content');
              res.body.data.should.have.property('creationDate');
              res.body.data.should.have.property('nickname');
              res.body.data.should.have.property('title');
              res.body.data.should.have.property('id').eql(articleID);

              done();
            });
        });
    });
  });
});
