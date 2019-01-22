process.env.NODE_ENV = 'test';
process.env.DEBUG = '';

// Require the dev-dependencies
const firebase = require('firebase');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');

const should = chai.should();

chai.use(chaiHttp);

const postArticleSuccess = {
  nickname: 'Tester',
  title: 'Article for test comments',
  content:
    'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...',
  creationDate: '2019-01-22 10:10:10'
};

const commentSuccess = {
  nickname: 'Tester',
  content: 'Comment on Article: {Article for test comments}',
  creationDate: '2019-01-22 11:10:10'
};

const commentSuccessForChild = {
  nickname: 'Tester',
  content: 'Second comment on Article: {Article for test comments}',
  creationDate: '2019-01-22 11:10:10'
};

const childCommentSuccess = {
  nickname: 'Tester',
  content: 'Comment on comment',
  creationDate: '2019-01-22 11:10:10'
};

let articleID = {};

describe('Comments', () => {
  // Ensure DB connection & empty DB
  before(done => {
    const testConnect = firebase.database().ref('.info/connected');
    testConnect.on('value', snap => {
      if (snap.val() === true) {
        chai
          .request(server)
          .post('/articles')
          .send(postArticleSuccess)
          .end((err, res) => {
            articleID = res.body.data.id;

            done();
          });
      }
    });
  });

  describe('GET /comments/:articleID', () => {
    it('it should return empty array of data for given articleID', done => {
      chai
        .request(server)
        .get(`/comments/${articleID}`)
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

  describe('POST /comments/:articleID/:commentID?', () => {
    it('it should add comment on given articleID', done => {
      chai
        .request(server)
        .post(`/comments/${articleID}`)
        .send(commentSuccess)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.code.should.be.eql(201);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Comment saved successfully.');
          res.body.data.should.have.property('id');
          done();
        });
    });
  });

  describe('GET /comments/:articleID', () => {
    it('it should list comments of given articleID', done => {
      chai
        .request(server)
        .get(`/comments/${articleID}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.code.should.be.eql(200);
          done();
        });
    });
  });

  describe('POST /comments/:articleID/:commentID?', () => {
    it('it should add comment on given commentID', done => {
      chai
        .request(server)
        .post(`/comments/${articleID}`)
        .send(commentSuccessForChild)
        .end((err, res) => {
          const commentID = res.body.data.id;

          chai
            .request(server)
            .post(`/comments/${articleID}/${commentID}`)
            .send(childCommentSuccess)
            .end((err2, res2) => {
              res2.should.have.status(200);
              res2.body.code.should.be.eql(201);
              res2.body.should.be.a('object');
              res2.body.should.have.property('message').eql('Comment saved successfully.');
              res2.body.data.should.have.property('id');
              done();
            });
        });
    });
  });
});
