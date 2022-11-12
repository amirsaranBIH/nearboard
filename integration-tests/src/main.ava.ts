import { Worker, NearAccount } from 'near-workspaces';
import anyTest, { TestFn } from 'ava';

const test = anyTest as TestFn<{
  worker: Worker;
  accounts: Record<string, NearAccount>;
}>;

test.beforeEach(async t => {
  const worker = await Worker.init();
  const root = worker.rootAccount;
  const contract = await root.devDeploy(process.argv[2]);
  /* Account that you will be able to use in your tests */
  const ali = await root.createSubAccount('ali');

  await root.call(contract, 'createProject', {
    name: "Project name",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    websiteUrl: "http://aurora.dev",
    logoUrl: "https://s2.coinmarketcap.com/static/img/coins/200x200/14803.png",
  }).catch(err => {
    t.fail(err.message);
  });

  await root.call(contract, 'createProject', {
    name: "Project name 2",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    websiteUrl: "http://aurora.dev",
    logoUrl: "https://s2.coinmarketcap.com/static/img/coins/200x200/14803.png",
  }).catch(err => {
    t.fail(err.message);
  });

  await root.call(contract, 'createEvent', {
    projectId: "1",
    name: "Event name",
    eventUrl: "https://aurora.dev",
    startDate: 2549836800000,
    eventType: "LiveEvent",
  }).catch(err => {
    t.fail(err.message);
  });

  await root.call(contract, 'createEvent', {
    projectId: "1",
    name: "Event name 2",
    eventUrl: "https://aurora.dev",
    startDate: 1603152000000,
    eventType: "OnlineEvent",
  }).catch(err => {
    t.fail(err.message);
  });

  await root.call(contract, 'createEvent', {
    projectId: "2",
    name: "Event name 3",
    eventUrl: "https://aurora.dev",
    startDate: 1603152000000,
    eventType: "AMA",
  }).catch(err => {
    t.fail(err.message);
  });

  await root.call(contract, 'createQuestion', {
    eventId: "1",
    question: "This is a question"
  }).catch(err => {
    t.fail(err.message);
  });

  await root.call(contract, 'createQuestion', {
    eventId: "2",
    question: "This is a question 2"
  }).catch(err => {
    t.fail(err.message);
  });

  await root.call(contract, 'createQuestion', {
    eventId: "2",
    question: "This is a question 3"
  }).catch(err => {
    t.fail(err.message);
  });

  await root.call(contract, 'followProject', {
    projectId: "1"
  }).catch(err => {
    t.fail(err.message);
  });

  await ali.call(contract, 'followProject', {
    projectId: "1"
  }).catch(err => {
    t.fail(err.message);
  });

  t.context.worker = worker;
  t.context.accounts = { contract, ali, root };
})

test.afterEach.always(async (t) => {
  // Stop Sandbox server
  await t.context.worker.tearDown().catch((error) => {
    console.log('Failed to stop the Sandbox:', error);
  });
});

test('returns project', async (t) => {
  const { contract } = t.context.accounts;

  const project: any = await contract.view('getProject', { projectId: "1" });
  t.is(project.name, "Project name");
});

test('returns all projects', async (t) => {
  const { contract } = t.context.accounts;

  const projects: any = await contract.view('getProjects', {});
  t.is(projects.length, 2);
});

test('returns user projects', async (t) => {
  const { contract, root } = t.context.accounts;

  const projects: any = await contract.view('getUserProjects', { accountId: root.accountId });
  t.is(projects.length, 2);
});

test('returns event', async (t) => {
  const { contract } = t.context.accounts;

  const event: any = await contract.view('getEvent', { eventId: "1" });
  t.is(event.name, "Event name");
});

test('returns project events', async (t) => {
  const { contract } = t.context.accounts;

  const projects: any = await contract.view('getProjectEvents', { projectId: "1" });
  t.is(projects.length, 2);
});

test('returns all events', async (t) => {
  const { contract } = t.context.accounts;

  const projects: any = await contract.view('getAllEvents');
  t.is(projects.length, 3);
});

test('returns question', async (t) => {
  const { contract } = t.context.accounts;

  const question: any = await contract.view('getQuestion', { questionId: "1" });
  t.is(question.question, "This is a question");
});

test('returns event questions', async (t) => {
  const { contract } = t.context.accounts;

  const questions: any = await contract.view('getEventQuestions', { eventId: "1" });
  t.is(questions.length, 1);
});

test('returns three upcoming events', async (t) => {
  const { contract } = t.context.accounts;

  const events: any = await contract.view('getThreeUpcomingEvents');
  t.is(events.length, 1);
});

test('returns project upcoming events', async (t) => {
  const { contract } = t.context.accounts;

  const events: any = await contract.view('getProjectUpcomingEvents', { projectId: "1" });
  t.is(events.length, 1);
});

test('returns project upcoming event', async (t) => {
  const { contract } = t.context.accounts;

  const event: any = await contract.view('getProjectUpcomingEvent', { projectId: "1" });
  t.is(event.name, "Event name");
});

test('returns project upcoming event questions', async (t) => {
  const { contract } = t.context.accounts;

  const questions: any = await contract.view('getProjectUpcomingEventQuestions', { projectId: "1" });
  t.is(questions.length, 1);
});

test('returns project previous events', async (t) => {
  const { contract } = t.context.accounts;

  const events: any = await contract.view('getProjectPreviousEvents', { projectId: "1" });
  t.is(events.length, 1);
});

test('returns three previous events', async (t) => {
  const { contract } = t.context.accounts;

  const events: any = await contract.view('getThreePreviousEvents');
  t.is(events.length, 2);
});

test('returns popular questions', async (t) => {
  const { contract } = t.context.accounts;

  const questions: any = await contract.view('getPopularQuestions');
  t.is(questions.length, 1);
});

test('returns top five popular projects', async (t) => {
  const { contract } = t.context.accounts;

  const projects: any = await contract.view('getTopFivePopularProjects');
  t.is(projects.length, 2);
});

test('returns user follows', async (t) => {
  const { contract, ali } = t.context.accounts;

  const follows: any = await contract.view('getUserFollows', { accountId: ali.accountId });
  t.is(follows.length, 1);
});

test('returns project followers', async (t) => {
  const { contract } = t.context.accounts;

  const followers: any = await contract.view('getProjectFollowers', { projectId: "1" });
  t.is(followers.length, 2);
});

test('creates a project', async (t) => {
  const { root, contract } = t.context.accounts;
  const createdProject: any = await root.call(contract, 'createProject', {
    name: "Project name",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    websiteUrl: "http://aurora.dev",
    logoUrl: "https://s2.coinmarketcap.com/static/img/coins/200x200/14803.png",
  }).catch(err => {
    t.fail(err.message);
  });

  const project: any = await contract.view('getProject', { projectId: createdProject.id });
  t.is(project.id, createdProject.id);
});

test('updates a project', async (t) => {
  const { root, contract } = t.context.accounts;
  const newProjectName = "Project name 2";
  const projectId = "1";
  await root.call(contract, 'updateProject', {
    id: projectId,
    name: newProjectName,
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    websiteUrl: "http://aurora.dev",
    logoUrl: "https://s2.coinmarketcap.com/static/img/coins/200x200/14803.png",
  }).catch(err => {
    t.fail(err.message);
  });

  const project: any = await contract.view('getProject', { projectId });
  t.is(project.name, newProjectName);
});

test('deletes a project', async (t) => {
  const { root, contract } = t.context.accounts;
  await root.call(contract, 'deleteProject', { projectId: "1" }).catch(err => {
    t.fail(err.message);
  });

  const projects: any = await contract.view('getProjects', {});

  t.is(projects.length, 1);
});

test('creates an event', async (t) => {
  const { root, contract } = t.context.accounts;
  const createdEvent: any = await root.call(contract, 'createEvent', {
    projectId: "1",
    name: "Event name",
    eventUrl: "https://aurora.dev",
    startDate: 2549836800000,
    eventType: "LiveEvent",
  }).catch(err => {
    t.fail(err.message);
  });

  const event: any = await contract.view('getEvent', { eventId: createdEvent.id });
  t.is(event.id, createdEvent.id);
});

test('updates an event', async (t) => {
  const { root, contract } = t.context.accounts;
  const eventId = "1";
  const newEventName = "Event name 2";
  await root.call(contract, 'updateEvent', {
    id: eventId,
    projectId: "1",
    name: newEventName,
    eventUrl: "https://aurora.dev",
    startDate: 2549836800000,
    eventType: "LiveEvent",
  }).catch(err => {
    t.fail(err.message);
  });

  const event: any = await contract.view('getEvent', { eventId });
  t.is(event.name, newEventName);
});

test('deletes an event', async (t) => {
  const { root, contract } = t.context.accounts;
  await root.call(contract, 'deleteEvent', { eventId: "1" }).catch(err => {
    t.fail(err.message);
  });

  const events: any = await contract.view('getAllEvents', {});

  t.is(events.length, 2);
});

test('creates a question', async (t) => {
  const { root, contract } = t.context.accounts;
  const createdQuestion: any = await root.call(contract, 'createQuestion', {
    eventId: "1",
    question: "This is a question"
  }).catch(err => {
    t.fail(err.message);
  });

  const question: any = await contract.view('getQuestion', { questionId: createdQuestion.id });
  t.is(question.id, createdQuestion.id);
});

test('updates a question', async (t) => {
  const { root, contract } = t.context.accounts;
  const questionId = "1";
  const newQuestionText = "This is a question 2";
  await root.call(contract, 'updateQuestion', {
    id: questionId,
    question: newQuestionText,
  }).catch(err => {
    t.fail(err.message);
  });

  const question: any = await contract.view('getQuestion', { questionId });
  t.is(question.question, newQuestionText);
});

test('deletes a question', async (t) => {
  const { root, contract } = t.context.accounts;
  await root.call(contract, 'deleteQuestion', { questionId: "1" }).catch(err => {
    t.fail(err.message);
  });

  const questions: any = await contract.view('getPopularQuestions', {});

  t.is(questions.length, 0);
});

test('votes', async (t) => {
  const { ali, contract } = t.context.accounts;

  const questionId = "1";

  await ali.call(contract, 'vote', { questionId }).catch(err => {
    t.fail(err.message);
  });

  const question: any = await contract.view('getQuestion', { questionId });

  t.is(question.votes.length, 2);
});

test('unvotes', async (t) => {
  const { ali, contract } = t.context.accounts;

  const questionId = "1";

  await ali.call(contract, 'vote', { questionId }).catch(err => {
    t.fail(err.message);
  });
  await ali.call(contract, 'unvote', { questionId }).catch(err => {
    t.fail(err.message);
  });

  const question: any = await contract.view('getQuestion', { questionId });

  t.is(question.votes.length, 1);
});

test('follows project', async (t) => {
  const { root, contract } = t.context.accounts;

  const projectId = "2";

  await root.call(contract, 'followProject', { projectId }).catch(err => {
    t.fail(err.message);
  });

  const followers: any = await contract.view('getProjectFollowers', { projectId });

  t.is(followers.length, 1);
});

test('unfollows project', async (t) => {
  const { root, contract } = t.context.accounts;

  const projectId = "2";

  await root.call(contract, 'followProject', { projectId }).catch(err => {
    t.fail(err.message);
  });

  await root.call(contract, 'unfollowProject', { projectId }).catch(err => {
    t.fail(err.message);
  });

  const followers: any = await contract.view('getProjectFollowers', { projectId });

  t.is(followers.length, 0);
});
