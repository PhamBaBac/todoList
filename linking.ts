
const config = {
    screens: {
        HomeScreen: {
            path: 'home',
        },
        TaskDetail: {
            path: 'task-detail/:id',
        }
    }
}

const linking: any = {
  prefixes: ['tolists://','https://event-hub-client.onrender.com'],
  config,
};

export default linking;