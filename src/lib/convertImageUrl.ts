export const convertImageUrl = (code) => {
    const url = new URL(`${import.meta.env.VITE_BASE_URL}?Code=`);
    url.searchParams.set("Code", code);
    return url.toString();
}