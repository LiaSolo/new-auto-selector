export default async function summurizeServerResponse(...promises) {
    const responses = await Promise.all(promises);
    const isError = responses.some(resp => resp.status === 'error');

    console.log(isError ? promises : 'ok')
    return isError ? 'error' : 'ok';
}