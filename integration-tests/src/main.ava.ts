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

  t.context.worker = worker;
  t.context.accounts = { contract, ali, root };
})

test.afterEach.always(async (t) => {
  // Stop Sandbox server
  await t.context.worker.tearDown().catch((error) => {
    console.log('Failed to stop the Sandbox:', error);
  });
});

test('returns all projects', async (t) => {
  const { contract } = t.context.accounts;

  const projects: any = await contract.view('getProjects', {});
  t.is(projects.length, 0);
});

test('creates a project', async (t) => {
  const { root, contract } = t.context.accounts;
  const createdProjectId: any = await root.call(contract, 'createProject', {
    name: "Project name",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    websiteUrl: "http://aurora.dev",
    logoUrl: "https://s2.coinmarketcap.com/static/img/coins/200x200/14803.png",
  }).catch(err => {
    t.fail(err.message);
  });

  const project: any = await contract.view('getProject', { projectId: createdProjectId });
  t.is(project.id, createdProjectId.toString());
});