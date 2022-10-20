!function(){"use strict";var C=Math.PI,r=Math.sin,o=Math.cos,S=Math.tan,j=Math.asin,x=Math.atan2,q=Math.acos,d=C/180,k=864e5,O=2440588,U=2451545;function T(n){return new Date((n+.5-O)*k)}function A(n){return function Z(n){return n.valueOf()/k-.5+O}(n)-U}var H=23.4397*d;function F(n,t){return x(r(n)*o(H)-S(t)*r(H),o(n))}function z(n,t){return j(r(t)*o(H)+o(t)*r(H)*r(n))}function N(n,t,e){return x(r(n),o(n)*r(t)-S(e)*o(t))}function R(n,t,e){return j(r(t)*r(e)+o(t)*o(e)*o(n))}function B(n,t){return d*(280.16+360.9856235*n)-t}function G(n){return d*(357.5291+.98560028*n)}function K(n){return n+d*(1.9148*r(n)+.02*r(2*n)+3e-4*r(3*n))+102.9372*d+C}function Q(n){var e=K(G(n));return{dec:z(e,0),ra:F(e,0)}}var l={getPosition:function(n,t,e){var u=d*-e,a=d*t,s=A(n),i=Q(s),c=B(s,u)-i.ra;return{azimuth:N(c,a,i.dec),altitude:R(c,a,i.dec)}}},E=l.times=[[-.833,"sunrise","sunset"],[-.3,"sunriseEnd","sunsetStart"],[-6,"dawn","dusk"],[-12,"nauticalDawn","nauticalDusk"],[-18,"nightEnd","night"],[6,"goldenHourEnd","goldenHour"]];l.addTime=function(n,t,e){E.push([n,t,e])};var V=9e-4;function W(n,t,e){return V+(n+t)/(2*C)+e}function X(n,t,e){return U+n+.0053*r(t)-.0069*r(2*e)}function en(n,t,e,u,a,s,i){var c=function nn(n,t,e){return q((r(n)-r(t)*r(e))/(o(t)*o(e)))}(n,e,u);return X(W(c,t,a),s,i)}function Y(n){var e=d*(134.963+13.064993*n),u=d*(93.272+13.22935*n),a=d*(218.316+13.176396*n)+6.289*d*r(e),s=5.128*d*r(u),i=385001-20905*o(e);return{ra:F(a,s),dec:z(a,s),dist:i}}function L(n,t){return new Date(n.valueOf()+t*k/24)}l.getTimes=function(n,t,e,u){var y,D,w,J,a=d*-e,s=d*t,i=function tn(n){return-2.076*Math.sqrt(n)/60}(u=u||0),f=function $(n,t){return Math.round(n-V-t/(2*C))}(A(n),a),M=W(0,a,f),m=G(M),p=K(m),P=z(p,0),g=X(M,m,p),h={solarNoon:T(g),nadir:T(g-.5)};for(y=0,D=E.length;y<D;y+=1)J=en(((w=E[y])[0]+i)*d,a,s,P,f,m,p),h[w[1]]=T(g-(J-g)),h[w[2]]=T(J);return h},l.getMoonPosition=function(n,t,e){var u=d*-e,a=d*t,s=A(n),i=Y(s),c=B(s,u)-i.ra,f=R(c,a,i.dec),M=x(r(c),S(a)*o(i.dec)-r(i.dec)*o(c));return f+=function _(n){return n<0&&(n=0),2967e-7/Math.tan(n+.00312536/(n+.08901179))}(f),{azimuth:N(c,a,i.dec),altitude:f,distance:i.dist,parallacticAngle:M}},l.getMoonIllumination=function(n){var t=A(n||new Date),e=Q(t),u=Y(t),a=149598e3,s=q(r(e.dec)*r(u.dec)+o(e.dec)*o(u.dec)*o(e.ra-u.ra)),i=x(a*r(s),u.dist-a*o(s)),c=x(o(e.dec)*r(e.ra-u.ra),r(e.dec)*o(u.dec)-o(e.dec)*r(u.dec)*o(e.ra-u.ra));return{fraction:(1+o(i))/2,phase:.5+.5*i*(c<0?-1:1)/Math.PI,angle:c}},l.getMoonTimes=function(n,t,e,u){var a=new Date(n);u?a.setUTCHours(0,0,0,0):a.setHours(0,0,0,0);for(var c,f,M,m,p,P,g,y,D,w,v,J,b,s=.133*d,i=l.getMoonPosition(a,t,e).altitude-s,h=1;h<=24&&(c=l.getMoonPosition(L(a,h),t,e).altitude-s,y=((p=(i+(f=l.getMoonPosition(L(a,h+1),t,e).altitude-s))/2-c)*(g=-(P=(f-i)/2)/(2*p))+P)*g+c,w=0,(D=P*P-4*p*c)>=0&&(v=g-(b=Math.sqrt(D)/(2*Math.abs(p))),J=g+b,Math.abs(v)<=1&&w++,Math.abs(J)<=1&&w++,v<-1&&(v=J)),1===w?i<0?M=h+v:m=h+v:2===w&&(M=h+(y<0?J:v),m=h+(y<0?v:J)),!M||!m);h+=2)i=f;var I={};return M&&(I.rise=L(a,M)),m&&(I.set=L(a,m)),!M&&!m&&(I[y>0?"alwaysUp":"alwaysDown"]=!0),I},"object"==typeof exports&&typeof module<"u"?module.exports=l:"function"==typeof define&&define.amd?define(l):window.SunCalc=l}();