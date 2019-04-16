import fetch from 'isomorphic-fetch';

export async function getRecord(fileId) {
  const response = await fetch(`/${fileId}`);
  if (response.status != 200) {
    throw new Error('Could not get record');
  }

  console.log(response.json());

  return response.json();
}
