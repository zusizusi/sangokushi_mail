# Project Title

三国志のゲームで使えるテキストエディタのソースコードです。

# Note

新機能、変更点などはdevブランチへプルリクエストでお願いします。確認したのちマージします。  
もともと仲間内で使う簡易ツールだったので、シンプルな HTML と JS で書いています。他の web フレームワークを使用する提案も歓迎です。

## License

The source code is licensed MIT. The website content is licensed CC BY 4.0,see LICENSE.

## Quick Start

本サービスを実行する時にファイルをブラウザ表示するだけで閲覧できます。

ターミナルで以下のような操作をすると表示できます。

```bash
### Sample
$ open index.html
```

しかしJsonがCORSにより取得できません。
手軽にHTTPプロトコルで表示する場合は、
以下のようなコマンドを実行してHTTPプロトコル経由で
利用してください。

```bash
# Python2の場合
$ python -m SimpleHTTPServer 8080
$ http://localhost:8080/

# Python3の場合
$ python3 -m http.server 8080
$ http://localhost:8080/
```
