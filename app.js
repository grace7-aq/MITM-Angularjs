var SUPABASE_URL = 'https://vkxumfqltdfplxbvurpx.supabase.co';
var SUPABASE_KEY = 'sb_publishable_cG5arzIfaOh9dv8g-SKxZw_8Znkyj9E';
var sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

angular.module('placementApp', ['ngRoute'])

.config(function ($routeProvider) {
  $routeProvider
    .when('/login', { templateUrl: 'login.html', controller: 'AuthCtrl' })
    .when('/jobs', { templateUrl: 'jobs.html', controller: 'JobsCtrl',
      resolve: { u: function (Session) { return Session.require('student')(); } } })
    .when('/my-applications', { templateUrl: 'myapps.html', controller: 'MyAppsCtrl',
      resolve: { u: function (Session) { return Session.require('student')(); } } })
    .when('/profile', { templateUrl: 'profile.html', controller: 'ProfileCtrl',
      resolve: { u: function (Session) { return Session.require('student')(); } } })
    .when('/recruiter/postings', { templateUrl: 'postings.html', controller: 'PostingsCtrl',
      resolve: { u: function (Session) { return Session.require('recruiter')(); } } })
    .when('/recruiter/applicants/:jobId', { templateUrl: 'applicants.html', controller: 'ApplicantsCtrl',
      resolve: { u: function (Session) { return Session.require('recruiter')(); } } })
    .otherwise({ redirectTo: '/login' });
})

.run(function ($rootScope, $location, Session) {
  $rootScope.S = Session;
  $rootScope.$on('$routeChangeError', function () { $location.path('/login'); });
})

// ---------- Session / role guard ----------
.factory('Session', function ($q, $location) {
  var S = { profile: null };
  S.load = function () {
    return $q.when(sb.auth.getSession()).then(function (r) {
      var u = r.data.session && r.data.session.user;
      if (!u) { S.profile = null; return null; }
      return $q.when(sb.from('profiles').select('*').eq('id', u.id).single())
        .then(function (p) { S.profile = p.data; return S.profile; });
    });
  };
  S.require = function (role) {
    return function () {
      return (S.profile ? $q.when(S.profile) : S.load())
        .then(function (p) { return p && p.role === role ? p : $q.reject('auth'); });
    };
  };
  S.logout = function () {
    return $q.when(sb.auth.signOut()).then(function () { S.profile = null; $location.path('/login'); });
  };
  return S;
})

// ---------- Login / Signup ----------
.controller('AuthCtrl', function ($scope, $q, $location, Session) {
  $scope.mode = 'login';
  $scope.f = { role: 'student' };
  $scope.err = '';
  function home() { $location.path(Session.profile.role === 'student' ? '/jobs' : '/recruiter/postings'); }
  $scope.submit = function () {
    $scope.err = '';
    var f = $scope.f;
    if ($scope.mode === 'login') {
      $q.when(sb.auth.signInWithPassword({ email: f.email, password: f.password })).then(function (r) {
        if (r.error) { $scope.err = r.error.message; return; }
        Session.load().then(function (p) { if (p) home(); else $scope.err = 'Profile not found.'; });
      });
    } else {
      $q.when(sb.auth.signUp({ email: f.email, password: f.password })).then(function (r) {
        if (r.error) { $scope.err = r.error.message; return; }
        if (!r.data.session) { $scope.err = 'Disable "Confirm email" in Supabase Auth settings, then retry.'; return; }
        var uid = r.data.user.id;
        var prof = { id: uid, full_name: f.name, role: f.role, cgpa: f.role === 'student' ? (f.cgpa || 0) : 0 };
        return $q.when(sb.from('profiles').insert(prof)).then(function (pr) {
          if (pr.error) { $scope.err = pr.error.message; return; }
          var next = f.role === 'recruiter'
            ? $q.when(sb.from('companies').insert({ name: f.company, owner: uid }))
            : $q.when({});
          return next.then(Session.load).then(home);
        });
      });
    }
  };
})

// ---------- Student: Job Board + Eligibility Guard + Apply ----------
.controller('JobsCtrl', function ($scope, $q, Session) {
  var me = Session.profile;
  $scope.me = me; $scope.jobs = []; $scope.applied = {}; $scope.applying = null; $scope.form = {};
  $scope.q = '';
  function load() {
    $q.all([
      $q.when(sb.from('job_postings').select('*, companies(name, logo_url)').eq('is_open', true).order('created_at', { ascending: false })),
      $q.when(sb.from('applications').select('job_id').eq('student_id', me.id))
    ]).then(function (r) {
      $scope.jobs = r[0].data || [];
      (r[1].data || []).forEach(function (a) { $scope.applied[a.job_id] = true; });
    });
  }
  $scope.eligible = function (j) { return Number(me.cgpa) >= Number(j.min_gpa); };
  $scope.openForm = function (j) {
    $scope.applying = j;
    $scope.form = { github: me.github, linkedin: me.linkedin, cover: '' };
  };
  $scope.apply = function () {
    var j = $scope.applying;
    $q.when(sb.from('applications').insert({
      job_id: j.id, student_id: me.id,
      cover: $scope.form.cover, github: $scope.form.github, linkedin: $scope.form.linkedin
    })).then(function (r) {
      if (r.error) { $scope.err = r.error.message; return; }
      $scope.applied[j.id] = true; $scope.applying = null; $scope.err = '';
    });
  };
  $scope.search = function (j) {
    var q = $scope.q.toLowerCase();
    return !q || (j.role + ' ' + j.companies.name + ' ' + (j.location || '')).toLowerCase().indexOf(q) > -1;
  };
  load();
})

// ---------- Student: Status Tracker ----------
.controller('MyAppsCtrl', function ($scope, $q, Session) {
  $scope.stages = ['Applied', 'Shortlisted', 'Interview', 'Hired'];
  $q.when(sb.from('applications').select('*, job_postings(role, ctc, companies(name))')
    .eq('student_id', Session.profile.id).order('applied_at', { ascending: false }))
    .then(function (r) { $scope.apps = r.data || []; });
})

.controller('ProfileCtrl', function ($scope, $q, Session) {
  var p = Session.profile;
  $scope.p = { full_name: p.full_name, cgpa: Number(p.cgpa), skills: p.skills, github: p.github, linkedin: p.linkedin };
  $scope.save = function () {
    $q.when(sb.from('profiles').update($scope.p).eq('id', p.id)).then(function (r) {
      if (r.error) { $scope.msg = r.error.message; return; }
      angular.extend(p, $scope.p); $scope.msg = 'Saved!';
    });
  };
})

// ---------- Recruiter: Postings ----------
.controller('PostingsCtrl', function ($scope, $q, Session) {
  var uid = Session.profile.id;
  $scope.j = {};
  function load() {
    $q.when(sb.from('companies').select('*').eq('owner', uid).single()).then(function (c) {
      $scope.company = c.data;
      return $q.when(sb.from('job_postings').select('*, applications(count)')
        .eq('company_id', c.data.id).order('created_at', { ascending: false }));
    }).then(function (r) { $scope.jobs = r.data || []; });
  }
  $scope.post = function () {
    var j = angular.copy($scope.j); j.company_id = $scope.company.id;
    if (j.deadline) j.deadline = j.deadline.toISOString().slice(0, 10);
    $q.when(sb.from('job_postings').insert(j)).then(function (r) {
      if (r.error) { $scope.err = r.error.message; return; }
      $scope.j = {}; $scope.err = ''; load();
    });
  };
  $scope.toggle = function (job) {
    $q.when(sb.from('job_postings').update({ is_open: !job.is_open }).eq('id', job.id))
      .then(function () { job.is_open = !job.is_open; });
  };
  load();
})

// ---------- Recruiter: Kanban Pipeline + Candidate Search ----------
.controller('ApplicantsCtrl', function ($scope, $q, $routeParams) {
  $scope.stages = ['Applied', 'Shortlisted', 'Interview', 'Hired'];
  $scope.skill = '';
  $q.all([
    $q.when(sb.from('job_postings').select('role, companies(name)').eq('id', $routeParams.jobId).single()),
    $q.when(sb.from('applications').select('*, profiles(full_name, cgpa, skills)').eq('job_id', $routeParams.jobId))
  ]).then(function (r) { $scope.job = r[0].data; $scope.apps = r[1].data || []; });

  $scope.inStage = function (s) {
    return function (a) {
      var k = $scope.skill.toLowerCase();
      return a.status === s && (!k || (a.profiles.skills || '').toLowerCase().indexOf(k) > -1);
    };
  };
  $scope.move = function (a, dir) {
    var i = $scope.stages.indexOf(a.status) + dir;
    if (i < 0 || i >= $scope.stages.length) return;
    var s = $scope.stages[i];
    $q.when(sb.from('applications').update({ status: s }).eq('id', a.id)).then(function (r) {
      if (!r.error) a.status = s;
    });
  };
});
