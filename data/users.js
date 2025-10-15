export let users = [
  {
    id: '1',
    username: 'Abd-Alrhman',
    email: 'test@any.com'
  }
];

export function get_user(userId)
{
  let matchingUser;
  users.forEach(user => {
    if(user.id === userId)
      matchingUser = user;
  });

  return matchingUser;
}
