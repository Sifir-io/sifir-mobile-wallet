package com.sifir;

import android.os.AsyncTask;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableMap;

import org.json.JSONObject;

import java.io.IOException;
import java.lang.reflect.Array;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class TorBridgeAsyncTask extends AsyncTask<String, String, HashMap<String, String>> {
    protected static final MediaType JSON = MediaType.get("application/json; charset=utf-8");
    protected OkHttpClient client;
    protected Promise mPromise;
    protected Exception error;

    public TorBridgeAsyncTask(Promise promise, OkHttpClient client) {
        this.mPromise = promise;
        this.client = client;
    }

    @Override
    protected void onPostExecute(HashMap<String,String> result) {
        if (this.error != null)
            mPromise.reject(this.error);
        else {
            WritableMap resp = Arguments.createMap();
            resp.putString("headers",result.get("headers"));
            resp.putString("body",result.get("body"));
            mPromise.resolve(resp);
        }

    }

    public HashMap run(String method, String url, String json, String signatureHeader) throws IOException {
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
            HashMap<String, String> resp = new HashMap<>();
            Map<String,List<String>> headers = response.headers().toMultimap();
            resp.put("headers",new JSONObject(headers).toString());
            resp.put("body",response.body().string());
            return resp;
        }
    }


    @Override
    protected HashMap<String, String> doInBackground(String... params) {
        try {
            return run(params[0], params[1], params[2], params[3]);
        } catch (Exception e) {
            this.error = e;
            HashMap<String,String> resp = new HashMap<>();
            resp.put("error",e.toString());
            return resp;
        }
    }

}


