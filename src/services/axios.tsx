import axios from 'axios'

interface RequestResponse {
    data: any;
    status: number;
    statusText: string;
    headers: any;
    config: any;
    request?: any;
}

interface ErrorResponse {
    response: RequestResponse;
}

export const putRequest = async (url: string, body: any): Promise<RequestResponse | undefined> => {
    try {
        const response: RequestResponse = await axios.put(url, body, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response;

    } catch (error: any) {
        return (error as ErrorResponse).response;
    }
}


interface FormDataResponse {
    data: any;
    status: number;
    statusText: string;
    headers: any;
    config: any;
    request?: any;
}

export const putRequestFD = async (url: string, formData: FormData): Promise<FormDataResponse | undefined> => {
    try {
        const response: FormDataResponse = await axios.put(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response;

    } catch (error: any) {
        return (error as ErrorResponse).response;
    }
}


interface PostRequestResponse {
    data: any;
    status: number;
    statusText: string;
    headers: any;
    config: any;
    request?: any;
}

interface PostErrorResponse {
    response: PostRequestResponse;
}

export const postRequest = async (url: string, body: any): Promise<PostRequestResponse | undefined> => {
    try {
        const response: PostRequestResponse = await axios.post(url, body, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response;

    } catch (error: any) {
        return (error as PostErrorResponse).response;
    }
}

interface PostImgResponse {
    data: any;
    status: number;
    statusText: string;
    headers: any;
    config: any;
    request?: any;
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
    } catch (error: any) {
        return (error as PostImgErrorResponse).response;
    }
};


interface PatchRequestResponse {
    data: any;
    status: number;
    statusText: string;
    headers: any;
    config: any;
    request?: any;
}

interface PatchErrorResponse {
    response: PatchRequestResponse;
}

export const patchRequest = async (url: string, body: any): Promise<PatchRequestResponse | undefined> => {
    try {
        const response: PatchRequestResponse = await axios.patch(url, body, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response;

    } catch (error: any) {
        return (error as PatchErrorResponse).response;
    }
}
interface GetRequestResponse {
    data: any;
    status: number;
    statusText: string;
    headers: any;
    config: any;
    request?: any;
}

interface GetErrorResponse {
    response: GetRequestResponse;
}

export const getRequest = async (url: string): Promise<GetRequestResponse | undefined> => {
    try {
        const response: GetRequestResponse = await axios.get(url);
        return response;

    } catch (error: any) {
        return (error as GetErrorResponse).response;
    }
}

interface DeleteRequestResponse {
    data: any;
    status: number;
    statusText: string;
    headers: any;
    config: any;
    request?: any;
}

interface DeleteErrorResponse {
    response: DeleteRequestResponse;
}

export const deleteRequest = async (url: string): Promise<DeleteRequestResponse | undefined> => {
    try {
        const response: DeleteRequestResponse = await axios.delete(url);
        return response;
    } catch (error: any) {
        return (error as DeleteErrorResponse).response;
    }
}