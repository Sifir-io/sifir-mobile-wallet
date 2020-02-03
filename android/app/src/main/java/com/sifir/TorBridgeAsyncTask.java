package com.sifir;

import android.os.AsyncTask;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableMap;

import org.json.JSONObject;

import java.io.IOException;
import java.util.List;
import java.util.Map;


import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class TorBridgeAsyncTask extends AsyncTask<String, String, WritableMap> {
    protected static final MediaType JSON = MediaType.get("application/json; charset=utf-8");
    protected OkHttpClient client;
    protected Promise mPromise;
    protected Exception error;

    public TorBridgeAsyncTask(Promise promise, OkHttpClient client) {
        this.mPromise = promise;
        this.client = client;
    }

    @Override
    protected void onPostExecute(WritableMap result) {
        if (this.error != null) {
            Log.d("TorBridge","error onPostExecute" + this.error.toString());
            mPromise.reject(this.error);
        }
        else {
            mPromise.resolve(result);

        }
        this.mPromise = null;
        this.error = null;
    }

    public WritableMap run(String method, String url, String json, String signatureHeader) throws IOException {
        Request.Builder request;
        switch (method) {
            case "POST":
                RequestBody body = RequestBody.create(this.JSON, json);
                request = new Request.Builder()
                        .url(url)
                        .post(body);
                break;
            case "GET":
                request = new Request.Builder()
                        .url(url);
                break;
            default:
                throw new IOException("Invalid method " + method);

        }
        // TODO refactor this into a more abstract and re-usable header fn
        if (signatureHeader.length() > 0) {
            request.addHeader("Content-Signature", signatureHeader);
        }
        try (Response response = this.client.newCall(request.build()).execute()) {
            WritableMap resp = Arguments.createMap();
            Map<String,List<String>> headers = response.headers().toMultimap();
            resp.putString("headers",new JSONObject(headers).toString());
            resp.putString("body",response.body().string());
            return resp;
        }
    }


    @Override
    protected WritableMap doInBackground(String... params) {
        try {
            return run(params[0], params[1], params[2], params[3]);
        } catch (Exception e) {
            this.error = e;
            WritableMap resp = Arguments.createMap();
            resp.putString("error",e.toString());
            return resp;
        }
    }

}


