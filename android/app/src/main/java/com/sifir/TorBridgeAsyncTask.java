package com.sifir;

import android.os.AsyncTask;

import com.facebook.react.bridge.Promise;

import java.io.IOException;


import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class TorBridgeAsyncTask extends AsyncTask<String, String, String> {
    protected static final MediaType JSON = MediaType.get("application/json; charset=utf-8");
    protected OkHttpClient client;
    protected Promise mPromise;
    protected Exception error;

    public TorBridgeAsyncTask(Promise promise, OkHttpClient client) {
        this.mPromise = promise;
        this.client = client;
    }

    @Override
    protected void onPostExecute(String result) {
        if (this.error != null)
            mPromise.reject(this.error);
        else mPromise.resolve(result);
    }

    public String run(String method, String url, String json) throws IOException {
        Request request;
        switch (method) {
            case "POST":
                RequestBody body = RequestBody.create(this.JSON, json);
                request = new Request.Builder()
                        .url(url)
                        .post(body)
                        .build();
                break;
            case "GET":
                request = new Request.Builder()
                        .url(url)
                        .build();
                break;
            default:
                throw new IOException("Invalid method " + method);

        }
        try (Response response = this.client.newCall(request).execute()) {
            return response.body().string();
        }
    }


    @Override
    protected String doInBackground(String... params) {
        try {
            String method = params[0];
            String onionUrl = params[1];
            String message = params[2];
            String reply = run(method, onionUrl, message);
            return reply;
        } catch (Exception e) {
            this.error = e;
            return e.toString();
        }
    }

}


