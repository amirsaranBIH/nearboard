import { Worker, NearAccount } from 'near-workspaces';
import anyTest, { TestFn } from 'ava';

const test = anyTest as TestFn<{
  worker: Worker;
  accounts: Record<string, NearAccount>;
}>;

test.beforeEach(async (t) => {
  // Init the worker and start a Sandbox server
  const worker = await Worker.init();

  // Deploy contract
  const root = worker.rootAccount;
  const contract = await root.createSubAccount('test-account');
  // Get wasm file path from package.json test script in folder above
  const nearboard = await contract.devDeploy(
    process.argv[2],
  );

  // Save state for test runs, it is unique for each test
  t.context.worker = worker;
  t.context.accounts = { root, contract, nearboard };
});

test.afterEach.always(async (t) => {
  // Stop Sandbox server
  await t.context.worker.tearDown().catch((error) => {
    console.log('Failed to stop the Sandbox:', error);
  });
});

test('returns all projects', async (t) => {
  const { nearboard } = t.context.accounts;
  const projects = await nearboard.view('getAllProjects', {});
  t.is(projects, []);
});

test('creates a project', async (t) => {
  const { root, nearboard } = t.context.accounts;
  const createdProjectId = await root.call(nearboard, 'createProject', {
    name: "Project name",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    websiteUrl: "http://aurora.dev",
    logoUrl: "https://s2.coinmarketcap.com/static/img/coins/200x200/14803.png",
  });
  const project: any = await nearboard.view('getProject', { projectId: createdProjectId });
  t.is(project.id, createdProjectId);
});