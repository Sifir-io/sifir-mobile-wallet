package com.sifir;

import android.os.AsyncTask;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

import java.util.Map;
import java.util.HashMap;

import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.Proxy;

public class TorBridge extends ReactContextBaseJavaModule {
    private static ReactApplicationContext reactContext;
    private static final String E_SEND_MESSAGE_ERROR = "E_LAYOUT_ERROR";
    public OkHttpClient client;
    public Proxy proxy = new Proxy(Proxy.Type.SOCKS, new InetSocketAddress("0.0.0.0", 9050));


    public TorBridge(ReactApplicationContext context) {
        super(context);
        reactContext = context;
        this.client = new OkHttpClient()
                .newBuilder()
                .proxy(this.proxy)
                .build();
    }

    @Override
    public String getName() {
        return "TorBridge";
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put(E_SEND_MESSAGE_ERROR, E_SEND_MESSAGE_ERROR);
        return constants;
    }

    @ReactMethod
    public void sendRequest(String onionUrl, String method, String message, Promise promise) {
        try {
            new TorBridgeAsyncTask(promise, this.client).execute(method, onionUrl, message);
        } catch (Exception e) {
            promise.reject(E_SEND_MESSAGE_ERROR, e);
        }
    }
}

