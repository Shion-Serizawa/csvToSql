import { parse } from "https://deno.land/std@0.177.0/encoding/csv.ts";

const decoder = new TextDecoder();
for await (const chunk of Deno.stdin.readable) {
  const filePath = decoder.decode(chunk);
  const notLFtext = filePath.replace(/\r?\n/g, "");

  console.log("csvファイル名を拡張子なしで入力->")
  const file = Deno.readFileSync(notLFtext + ".csv");
  // console.log(file)
  const charDecoder = new TextDecoder();
  // console.log(charDecoder.decode(file));
  const result = await parse(charDecoder.decode(file));
  // console.log(result[2][0]);

  let sqlFirstPirt:string = "INSERT INTO \"" + result[0][0] + "\" (";
  //1行目：テーブル名　2行目：カラム名の処理
  for (let i = 0; i < result[1].length; i++) {
    if(i == result[1].length - 1){
      sqlFirstPirt += result[1][i] + ") VALUES ('"
    }else
      sqlFirstPirt += result[1][i] + ", " 
  }

  //3行目~：データの処理
  for (let i = 2; i < result.length; i++) {
    let sqlOut:string = sqlFirstPirt;
    for (let j = 0; j < result[1].length; j++) {
      if(j == result[1].length - 1){
        sqlOut += result[i][j] + "');"
      }else
      sqlOut += result[i][j] + "', '"
    }
    console.log(sqlOut)

  }
  break;
}
