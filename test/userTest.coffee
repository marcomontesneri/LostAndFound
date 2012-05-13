chai = require 'chai'
should = chai.should()

common = require '../common'

common.init 'mongodb://localhost:27017/test1'

User = require '../data/User'

describe 'User', ->
	
	before ->
		User.remove {}, (err) ->
			console.log err if err

	user = null
	userData =
		firstName: 'UserTest1'
		lastName: 'ln'
		email:'unique@email.org'
		phone:'0129201'
		password:'password'

	user2Data =
		firstName: 'UserTest2'
		lastName: 'ln'
		email:'unique2@email.org'
		phone:'01292012'
		password:'password'
	
	describe 'Creation', ->

		it 'should construct with valid data', (done) ->
			User.create userData, (err, doc) ->
				should.not.exist err
				should.exist doc
				user = doc
				done()
		it 'should save a different password', ->
			userData.password.should.not.equal user.password

		it 'should validate original password', ->
			user.comparePassword userData.password, (err, res)->
				should.exist res
				should.not.exist err
				res.should.be.ok

	describe 'Creation constraints', ->
		it 'should be created if email differs', (done) ->
			User.create user2Data, (err, doc) ->
				should.not.exist err
				should.exist doc
				done()

		it 'should not allow duplicate email', (done) ->
			User.create userData, (err, doc) ->
				should.exist err
				should.not.exist doc
				done()

		it 'should not allow empty firstName', (done) ->
			invalidUserData =
				firstName: null
				lastName: 'noFirstName'
				email:'uniqueNOFIRSTNAME@email.org'
				phone:'0129201'
				password:'password'
			User.create userData, (err, doc) ->
				should.exist err
				should.not.exist doc
				done()
		
		it 'should not allow empty lastName', (done) ->
			invalidUserData =
				firstName: 'noLastName'
				lastName: null
				email:'uniqueNOLASTNAME@email.org'
				phone:'0129201'
				password:'password'
			User.create userData, (err, doc) ->
				should.exist err
				should.not.exist doc
				done()
		
		it 'should not allow empty email', (done) ->
			invalidUserData =
				firstName: 'noEmail'
				lastName: 'lastName'
				email:null
				phone:'0129201'
				password:'password'
			User.create userData, (err, doc) ->
				should.exist err
				should.not.exist doc
				done()

		it 'should not allow empty password', (done) ->
			invalidUserData =
				firstName: 'noPassword'
				lastName: 'ln'
				email:'noPassword@email.com'
				phone:'0129201'
				password:null
			User.create userData, (err, doc) ->
				should.exist err
				should.not.exist doc
				done()
		it 'should not allow empty phone', (done) ->
			invalidUserData =
				firstName: 'noPhone'
				lastName: 'ln'
				email:'noPhone@email.com'
				phone:null
				password:'password'
			User.create userData, (err, doc) ->
				should.exist err
				should.not.exist doc
				done()

	describe 'findCleanedOne', ->
		it 'should return a user on existing email filter', (done)->
			User.findCleanedOne {email:userData.email}, (err, cleanedUser)->
				should.exist cleanedUser
				cleanedUser.email.should.equal userData.email
				done()

		it 'should not return password', (done)->
			User.findCleanedOne {email:userData.email}, (err, cleanedUser)->
				should.exist cleanedUser
				cleanedUser.should.not.have.property 'password'
				done()
		it 'should not return _id', (done)->
			User.findCleanedOne {email:userData.email}, (err, cleanedUser)->
				should.exist cleanedUser
				cleanedUser.should.not.have.property '_id'
				done()
		it 'should return nothing if filter is wrong', (done)->
			User.findCleanedOne {email:'wrong'}, (err, cleanedUser)->
				should.not.exist cleanedUser
				done()

	describe 'findCleaned', ->
		it 'should return everything with empty filter', (done)->
			User.findCleaned {}, (err, cleanedUsers)->
				cleanedUsers.should.have.length 2
				done()
		
		it 'should return only one user with a correct email filter', (done)->
			User.findCleaned {email: userData.email}, (err, cleanedUsers)->
				cleanedUsers.should.have.length 1
				cleanedUsers[0].email.should.equal userData.email
				done()
				
		it 'should not return any user with an unexisting email filter', (done)->
			User.findCleaned {email: 'unexisting'}, (err, cleanedUsers)->
				cleanedUsers.should.have.length 0
				done()

		it 'should not return password', (done)->
			User.findCleaned {}, (err, cleanedUsers)->
				for cleanedUser in cleanedUsers
					do (cleanedUser) ->
						should.exist cleanedUser
						cleanedUser.should.not.have.property 'password'
				done()
				
		it 'should not return _id', (done)->
			User.findCleaned {}, (err, cleanedUsers)->
				for cleanedUser in cleanedUsers
					do (cleanedUser) ->
						should.exist cleanedUser
						cleanedUser.should.not.have.property '_id'
				done()
