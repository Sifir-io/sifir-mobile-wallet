package com.sifir;

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
		public static final MediaType JSON = MediaType.get("application/json; charset=utf-8");
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
			 // constants.put(DURATION_SHORT_KEY, TorBridge.LENGTH_SHORT);
			 constants.put(E_SEND_MESSAGE_ERROR,E_SEND_MESSAGE_ERROR );
			 return constants;
		       }

	    public String run(String url,String json) throws IOException {
		      RequestBody body = RequestBody.create(this.JSON,json);
		      Request request = new Request.Builder()
				        .url(url)
					.post(body)
				        .build();

		     try (Response response = this.client.newCall(request).execute()) {
		          return response.body().string();
	      		}
	     }
	   	    
  @ReactMethod
	  public void sendMessage(String onionUrl, String message,Promise promise) {
			try{
         String reply;
	 	reply = this.run(onionUrl,message);
promise.resolve(reply);
}catch(Exception e){
	promise.reject(E_SEND_MESSAGE_ERROR,e);
}
		       }
}

