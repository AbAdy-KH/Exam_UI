export let subjects = [
  {
    id: '1',
    name: 'programming'
  }, 
  {
    id: '2',
    name: 'Math'
  },
  {
    id: '3', 
    name: 'Network'
  }
];

export function get_subject(subjectId)
{
  let matchingSub;
  subjects.forEach(sub => {
    if(sub.id === subjectId)
      matchingSub = sub;
  });

  return matchingSub;
}
