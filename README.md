# app-icon-maker

通过一张指定的icon自动生成APP各分辨率的图标.
- ios图标(Xcode工程的Assets.xcassets/AppIcon.appiconset目录),包含配置文件
- android图标(src/main/res目录下)

注意: 
- **node版本需要大于18.17.0**, 
- 安卓图标没有考虑`xxx-xxx-v26`的文件夹,自适应图标会有点复杂


## 使用方法

- 一般来说仅需要替换项目中的`icon.png`, 如有需要同时替换项目中的`ios.json`或者`android.json`
- 运行`npm i`
- 运行`npm run build`
