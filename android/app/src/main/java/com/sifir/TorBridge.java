package com.sifir;

import android.os.AsyncTask;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import android.util.Log;

import okhttp3.OkHttpClient;

import java.net.InetSocketAddress;
import java.net.Proxy;
import java.util.concurrent.TimeUnit;

public class TorBridge extends ReactContextBaseJavaModule {
    private static ReactApplicationContext reactContext;
    public OkHttpClient client;
    public Proxy proxy;

    public TorBridge(ReactApplicationContext context) {
        super(context);
        reactContext = context;
        // TODO supply url/port
        proxy = new Proxy(Proxy.Type.SOCKS, new InetSocketAddress("0.0.0.0", 9050));
        this.client = new OkHttpClient()
                .newBuilder()
                .proxy(this.proxy)
                .connectTimeout(10, TimeUnit.SECONDS)
                .writeTimeout(10, TimeUnit.SECONDS)
                .readTimeout(10, TimeUnit.SECONDS)
                .build();
    }

    @Override
    public String getName() {
        return "TorBridge";
    }

    @ReactMethod
    public void sendRequest(String onionUrl, String method, String message, String signatureHeader, Promise promise) {
        try {
//            new TorBridgeAsyncTask(promise, this.client).execute(method, onionUrl, message, signatureHeader);
            new TorBridgeAsyncTask(promise, this.client).executeOnExecutor(AsyncTask.THREAD_POOL_EXECUTOR,method, onionUrl, message, signatureHeader);
        } catch (Exception e) {
            Log.d("TorBridge","error on sendRequest" + e.toString());
            promise.reject(e);
        }
    }
}

