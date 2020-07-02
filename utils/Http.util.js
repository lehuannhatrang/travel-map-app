import Q from 'q';
import axios from 'axios';
import queryString from 'query-string';
import Config from '../configs';
import { AsyncStorage } from 'react-native';

class HttpUtil {

    //create http request
    static async makeHttpRequest(methodOriginal, urlOriginal, data, customHeaders) {
        let deferred = Q.defer();
        let isAbsolutePath = urlOriginal && (urlOriginal.startsWith('http://') || urlOriginal.startsWith('https://'));
        if (!isAbsolutePath) {
            urlOriginal = urlOriginal.startsWith('/') ? urlOriginal : '/' + urlOriginal;
        }
        const method = methodOriginal.toLowerCase();
        let url = isAbsolutePath ? urlOriginal : Config.BACKEND_API_URL + urlOriginal;
        let config = {
            method: method,
            url: url,
            withCredentials: true,
        };

        if (data) {
            const paramsTxt = queryString.stringify(data);
            if (method === 'get' || method === 'delete')
                config['url'] = url + '?' + paramsTxt;
            else if (method === 'post' || method === 'put')
                config['data'] = data;
        }

        let headers = customHeaders;
        config['headers'] = headers;

        try {
            let retReq = await axios(config);
            if (Array.isArray(retReq.data) || retReq.status === 200)
                deferred.resolve(retReq.data);
            else
                deferred.reject(retReq.data);

        } catch (err) {
            deferred.reject(err);
        }

        return deferred.promise;
    }

    static makeJsonRequest(methodOriginal, urlOriginal, data, customHeaders) {
        let headers = { 'Content-type': 'application/json', 'Accept': 'application/json' };

        if (customHeaders) {
            for (var cusHead in customHeaders) {
                headers[cusHead] = customHeaders[cusHead];
            }
        }

        return HttpUtil.makeHttpRequest(methodOriginal, urlOriginal, data, headers);
    }

    static makeMultipartRequest(methodOriginal, urlOriginal, formData, customHeaders) {
        let headers = { 'Content-type': 'multipart/form-data', 'Accept': 'multipart-form-data' };

        if (customHeaders) {
            for (var cusHead in customHeaders) {
                headers[cusHead] = customHeaders[cusHead];
            }
        }

        return HttpUtil.makeHttpRequest(methodOriginal, urlOriginal, formData, headers);
    }


    // CRUD JSON

    static getJson(path, data, headers) {
        return HttpUtil.makeJsonRequest('GET', path, data, headers);
    }

    static postJson(path, data, headers) {
        return HttpUtil.makeJsonRequest('POST', path, data, headers);
    }

    static putJson(path, data, headers) {
        return HttpUtil.makeJsonRequest('PUT', path, data, headers);
    }

    static deleteJson(path, data, headers) {
        return HttpUtil.makeJsonRequest('DELETE', path, data, headers);
    }

    // CRUD with Authorization
    static getJsonAuthorization(path, data, headers) {
        return AsyncStorage.getItem('accessToken')
        .then(accessToken => {
            headers = {...headers, Authorization: accessToken}
            return HttpUtil.makeJsonRequest('GET', path, data, headers);
        })
    }

    static postJsonAuthorization(path, data, headers) {
        return AsyncStorage.getItem('accessToken')
        .then(accessToken => {
            headers = {...headers, Authorization: accessToken}
            return HttpUtil.makeJsonRequest('POST', path, data, headers);
        })
    }

    static putJsonAuthorization(path, data, headers) {
        return AsyncStorage.getItem('accessToken')
        .then(accessToken => {
            headers = {...headers, Authorization: accessToken}
            return HttpUtil.makeJsonRequest('PUT', path, data, headers);
        })
    }

    static deleteJsonAuthorization(path, data, headers) {
        return AsyncStorage.getItem('accessToken')
        .then(accessToken => {
            headers = {...headers, Authorization: accessToken}
            return HttpUtil.makeJsonRequest('DELETE', path, data, headers);
        })
    }

    static postMultipartAuthorization(path, data, headers) {
        return AsyncStorage.getItem('accessToken')
        .then(accessToken => {
            headers = {...headers, Authorization: accessToken}
            return HttpUtil.makeMultipartRequest('POST', path, data, headers);
        })
    }

}

export default HttpUtil;