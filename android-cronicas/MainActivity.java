package br.com.portaldahistoria.cronicas;

import android.app.Activity;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.WindowInsets;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Collections;

/** Bundled, offline game. HTTPS virtual origin keeps browser storage and APIs working. */
public final class MainActivity extends Activity {
    private WebView web;
    private static final String HOST = "appassets.androidplatform.net";
    private static final String HOME = "https://" + HOST + "/game/cronicas/?native=1";
    private static boolean local(Uri uri) { return "https".equals(uri.getScheme()) && HOST.equals(uri.getHost()) && uri.getPath()!=null && uri.getPath().startsWith("/game/"); }
    private static String mime(String path) {
        if(path.endsWith(".html")) return "text/html";
        if(path.endsWith(".js")) return "text/javascript";
        if(path.endsWith(".css")) return "text/css";
        if(path.endsWith(".webmanifest")) return "application/manifest+json";
        if(path.endsWith(".png")) return "image/png";
        if(path.endsWith(".webp")) return "image/webp";
        if(path.endsWith(".woff2")) return "font/woff2";
        if(path.endsWith(".svg")) return "image/svg+xml";
        return "application/octet-stream";
    }
    private WebResourceResponse missing(){return new WebResourceResponse("text/plain","UTF-8",404,"Not Found",Collections.emptyMap(),new ByteArrayInputStream(new byte[0]));}
    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        web=new WebView(this);
        web.setBackgroundColor(Color.rgb(41,28,22));
        web.getSettings().setJavaScriptEnabled(true);
        web.getSettings().setDomStorageEnabled(true);
        web.getSettings().setAllowFileAccess(false);
        web.getSettings().setAllowContentAccess(false);
        web.getSettings().setBlockNetworkLoads(true);
        web.setWebViewClient(new WebViewClient(){
            @Override public boolean shouldOverrideUrlLoading(WebView view,WebResourceRequest request){return !local(request.getUrl());}
            @Override public WebResourceResponse shouldInterceptRequest(WebView view,WebResourceRequest request){
                Uri uri=request.getUrl();if(!local(uri))return missing();
                String path=uri.getPath().substring("/game/".length());
                if(path.contains("..")||path.contains("\\"))return missing();
                if(path.endsWith("/"))path+="index.html";
                try{return new WebResourceResponse(mime(path),"UTF-8",getAssets().open("game/"+path));}catch(IOException e){return missing();}
            }
        });
        FrameLayout root=new FrameLayout(this);root.setBackgroundColor(Color.rgb(41,28,22));root.addView(web,new FrameLayout.LayoutParams(-1,-1));
        if(Build.VERSION.SDK_INT>=30){getWindow().setDecorFitsSystemWindows(false);root.setOnApplyWindowInsetsListener((v,insets)->{android.graphics.Insets bars=insets.getInsets(WindowInsets.Type.systemBars()|WindowInsets.Type.displayCutout());v.setPadding(bars.left,bars.top,bars.right,bars.bottom);return WindowInsets.CONSUMED;});}
        else{getWindow().setStatusBarColor(Color.rgb(56,35,24));getWindow().setNavigationBarColor(Color.rgb(56,35,24));}
        setContentView(root);root.requestApplyInsets();web.loadUrl(HOME);
    }
    @Override public void onBackPressed(){new android.app.AlertDialog.Builder(this).setTitle("Sair do jogo?").setMessage("O progresso da campanha será mantido.").setNegativeButton("Continuar jogando",null).setPositiveButton("Sair",(dialog,which)->finish()).show();}
    @Override protected void onDestroy(){if(web!=null)web.destroy();super.onDestroy();}
}
