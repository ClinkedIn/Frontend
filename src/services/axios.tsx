import axios from 'axios'

interface RequestResponse {
    data: unknown;
    status: number;
    statusText: string;
    headers: unknown;
    config: unknown;
    request?: unknown;
}

interface ErrorResponse {
    response: RequestResponse;
}

export const putRequest = async (url: string, body: unknown): Promise<RequestResponse | undefined> => {
    try {
        const response: RequestResponse = await axios.put(url, body, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response;

    } catch (error: unknown) {
        return (error as ErrorResponse).response;
    }
}


interface FormDataResponse {
    data: unknown;
    status: number;
    statusText: string;
    headers: unknown;
    config: unknown;
    request?: unknown;
}

export const putRequestFD = async (url: string, formData: FormData): Promise<FormDataResponse | undefined> => {
    try {
        const response: FormDataResponse = await axios.put(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response;

    } catch (error: unknown) {
        return (error as ErrorResponse).response;
    }
}


interface PostRequestResponse {
    data: unknown;
    status: number;
    statusText: string;
    headers: unknown;
    config: unknown;
    request?: unknown;
}

interface PostErrorResponse {
    response: PostRequestResponse;
}

export const postRequest = async (url: string, body: unknown): Promise<PostRequestResponse | undefined> => {
    try {
        const response: PostRequestResponse = await axios.post(url, body, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response;

    } catch (error: unknown) {
        return (error as PostErrorResponse).response;
    }
}

interface PostImgResponse {
    data: unknown;
    status: number;
    statusText: string;
    headers: unknown;
    config: unknown;
    request?: unknown;
}

interface PostImgErrorResponse {
    response: PostImgResponse;
}

export const postRequestImg = async (url: string, formData: FormData): Promise<PostImgResponse | undefined> => {
    try {
        const response: PostImgResponse = await axios.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response;
    } catch (error: unknown) {
        return (error as PostImgErrorResponse).response;
    }
};


interface PatchRequestResponse {
    data: unknown;
    status: number;
    statusText: string;
    headers: unknown;
    config: unknown;
    request?: unknown;
}

interface PatchErrorResponse {
    response: PatchRequestResponse;
}

export const patchRequest = async (url: string, body: unknown): Promise<PatchRequestResponse | undefined> => {
    try {
        const response: PatchRequestResponse = await axios.patch(url, body, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response;

    } catch (error: unknown) {
        return (error as PatchErrorResponse).response;
    }
}
interface GetRequestResponse {
    data: unknown;
    status: number;
    statusText: string;
    headers: unknown;
    config: unknown;
    request?: unknown;
}

interface GetErrorResponse {
    response: GetRequestResponse;
}

export const getRequest = async (url: string): Promise<GetRequestResponse | undefined> => {
    try {
        const response: GetRequestResponse = await axios.get(url);
        return response;

    } catch (error: unknown) {
        return (error as GetErrorResponse).response;
    }
}

interface DeleteRequestResponse {
    data: unknown;
    status: number;
    statusText: string;
    headers: unknown;
    config: unknown;
    request?: unknown;
}

interface DeleteErrorResponse {
    response: DeleteRequestResponse;
}

export const deleteRequest = async (url: string): Promise<DeleteRequestResponse | undefined> => {
    try {
        const response: DeleteRequestResponse = await axios.delete(url);
        return response;
    } catch (error: unknown) {
        return (error as DeleteErrorResponse).response;
    }
}


export const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true,
});