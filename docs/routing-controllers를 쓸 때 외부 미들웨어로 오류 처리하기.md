
아래와 같이 `res.finished` 로 체크하는 형태로 에러 처리가 가능하다.

```js
// useExpressServer로 할 때 Middleware를 먼저 use해버리면 Controller, Middleware가 읽히지 않음.
expressApp.use(function (req, res, next) {
  // deprecated이지만, 어차피 Express 자체가 업데이트가 전무하니 사실상 정상 필드.
  if (!res.finished) {
      res.render(
        'error22',
          {
              status: 404,
              message: `[GlobalErrorHandler] Cannot ${req.method} ${req.url}`,
          }
      );
  }
  res.end();
});
```