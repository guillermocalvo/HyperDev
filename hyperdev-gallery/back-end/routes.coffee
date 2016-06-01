# api: https://docs.google.com/a/fogcreek.com/document/d/111_qokjtMcaA478bO7JGUM_iS5XHREos5XgJ0tdShzE/edit?usp=sharing
stub = require './db-stub.coffee'
_ = require 'underscore'
fuzzy = require 'fuzzy'

module.exports = (app) ->


  ### GET ###


  # public project [unfinished]
  # app.get '/project/:uuid', (request, response) ->
  #   uuid = request.params.uuid
  #   response.end "you requested project object for the project id: #{uuid}"


  # list of public projects
  app.get '/projects', (request, response) ->
    # later, optional param: limit=int
    params = request.query
    response.send stub.projects()


  # search projects
  # based on name, then description
  app.get '/projects/search/:query', (request, response) ->
    projectIds = []
    results = []
    query = decodeURIComponent request.params.query
    projects = stub.projects()
    nameOptions =
      pre: '<span class="result-match">'
      post: '</span>'
      extract: (el) ->
        return el.name
    descriptionOptions =
      pre: '<span class="result-match">'
      post: '</span>'
      extract: (el) ->
        return el.description
    nameResults = fuzzy.filter(query, projects, nameOptions)
    descriptionResults = fuzzy.filter(query, projects, descriptionOptions)
    allResults = nameResults.concat descriptionResults
    for result in allResults
      resultId = result.original.projectId
      unless _.contains(projectIds, resultId)
        projectIds.push resultId
        results.push result
    response.send results


  # get all categories
  app.get '/categories', (request, response) ->
    response.send stub.categories()


  # get projects in a category
  app.get '/category/:uuid', (request, response) ->
    uuid = parseInt(request.params.uuid, 10)
    console.log uuid
    projects = _.filter stub.projects(), (project) ->
      return project.categoryId is uuid
    response.send projects


  # user
  app.get '/user/:uuid', (request, response) ->
    params = request.query
    uuid = request.params.uuid
    response.end "you requested user ojbect for the user id: #{uuid}"

  renderIndex = (request, response) ->
    response.render 'index.jade',
        title: 'Made with HyperDev'
        categories: stub.categories()
        projects: stub.projects()

  app.get '/', renderIndex
  app.get '/community/', renderIndex

  ### POST ###


  ## Projects ##

  # # record new project
  # # required params: name(string), editorUrl(string), appUrl(string), user(uuid)
  # # optional params: isPublic(bool), description(string), likes(int), remixes(int)
  # app.post '/project/create/:uuid', (request, response) ->
  #   params = request.query
  #   uuid = request.params.uuid
  #   #if self.isAuthenticated params
  #     #db.create
  #       #isProject:     true
  #       #name:          params.name
  #       #uuid:          uuid
  #       #editorUrl:     params.editorUrl
  #       #appUrl:        params.appUrl
  #       #isPublic:      false or params.isPublic
  #       #description:   '' or params.description
  #       #users:         [params.user]
  #       #likes:         0 or params.likes
  #       #remixes:       0 or params.remixes
  #     #.then (project) ->
  #       #response.send project
  #   response.end "you recorded a new project w id: #{uuid}"

  # # update project
  # # optional params: user(uuid), liked(bool), remixed(bool), name(string), editorUrl(string), appUrl(string)
  # app.post '/project/update/:uuid', (request, response) ->
  #   params = request.query
  #   uuid = request.params.uuid
  #   #if self.isAuthenticated params
  #     #if params.user
  #       #params.user = self.getProjectUsers(uuid).push params.user
  #     #if params.liked
  #       #params.likes = self.getProjectLikes(uuid) + 1
  #     #if params.remixed
  #       #params.remixes = self.getProjectRemixes(uuid) + 1
  #     #db.update
  #         #uuid: uuid
  #         #isProject: true
  #       #,
  #         #params
  #       #.then (projects) ->
  #         #response.send projects[0]
  #   response.end "you updated the project w id: #{uuid}"

  # # remove project record
  # app.delete '/project/:uuid', (request, response) ->
  #   params = request.query
  #   uuid = request.params.uuid
  #   #if self.isAuthenticated params
  #     #db.remove
  #       #uuid: uuid
  #       #isProject: true
  #     #.then (projects) ->
  #       #response.send "deleted: ", projects
  #   response.end "you removed the project w id: #{uuid}"


  # ## Users ##

  # # record new user
  # # required params: fullName(string), avatarUrl(string), loginName(string)
  # # optional params: project(project uuid)
  # app.post '/user/create/:uuid', (request, response) ->
  #   params = request.query
  #   uuid = request.params.uuid
  #   #if self.isAuthenticated params
  #     #project = null or params.project
  #     #db.create
  #       #isUser:        true
  #       #fullName:    params.fullName
  #       #avatarUrl:   params.avatarUrl
  #       #loginName:   params.loginName
  #       #lastLogin:   new Date()
  #       #likes:       []
  #       #remixes:     []
  #       #projects:    [project]
  #   response.end "you recorded a new user w id: #{uuid}"

  # # update user
  # # optional params: fullName(string), avatarUrl(string), loginName(string), joinedProject(projectUuid), remixed(projectUuid), liked(projectUuid)
  # app.post '/user/update/:uuid', (request, response) ->
  #   params = request.query
  #   uuid = request.params.uuid
  #   #if self.isAuthenticated params
  #     #if params.liked
  #       #params.likes = self.getUserLikes(uuid).push params.liked
  #     #if params.remixed
  #       #params.remixes = self.getUserRemixes(uuid).push params.remixed
  #     #if params.joinedProject
  #       #params.projects = self.getUserProjects(uuid).push params.joinedProject
  #     #db.update
  #         #uuid: uuid
  #         #isUser:true
  #       #,
  #         #params
  #       #.then (users) ->
  #         #response.send users[0]
  #   response.end "you updated the user w id: #{uuid}"

  # # remove user
  # app.delete '/user/:uuid', (request, response) ->
  #   params = request.query
  #   # if self.isAuthenticated params
  #     # uuid = request.params.uuid
  #     # db remove proeject w uuid
  #   response.end "stub: you removed the project w id: #{uuid}"


  ### Helpers ###


  helpers =

    # isAuthenticated: (params) ->
    #   token = params.token
    #   token is process.env.SECRET
    #   # throw an error/response.end if it isn't

    # getProjectUsers: (uuid) ->
    #   db.find
    #     uuid: uuid
    #     isProject: true
    #   .then (projects) ->
    #     projects[0].users

    # getProjectLikes: (uuid) ->
    #   db.find
    #     uuid: uuid
    #     isProject: true
    #   .then (projects) ->
    #     projects[0].likes

    # getProjectRemixes: (uuid) ->
    #   db.find
    #     uuid: uuid
    #     isProject: true
    #   .then (projects) ->
    #     projects[0].remixes

    # getUserLikes: (uuid) ->
    #   db.find
    #     uuid: uuid
    #     isUser: true
    #   .then (users) ->
    #     users[0].likes

    # getUserRemixes: (uuid) ->
    #   db.find
    #     uuid: uuid
    #     isUser: true
    #   .then (users) ->
    #     users[0].remixes

    # getUserProjects: (uuid) ->
    #   db.find
    #     uuid: uuid
    #     isUser: true
    #   .then (users) ->
    #     users[0].projects


# todo: need to add response codes , 200 etc.
# todo: add error response msgs (i.e. typeof params, invalid token, ..)
# todo check that required params are present

# v2 todo: add route for removing a user from a project

  # Must be after other routes
  # Handle 404
  app.use (req, res) ->
    res.status(404)
    res.render('404.html')
