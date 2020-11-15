# 命令

You may start IDM from the command line using the following parameters
 
```
idman /s
or
idman /d URL [/p local_path] [/f local_file_name] [/q] [/h] [/n] [/a]
 
Parameters:
/d URL - downloads a file
         e.g. IDMan.exe /d "http://www.internetdownloadmanager.com/path/File Name.zip" 
/s - starts queue in scheduler
/p local_path - defines the local path where to save the file
/f  local_file_name - defines the local file name to save the file
/q - IDM will exit after the successful downloading. This parameter works only for the first copy
/h - IDM will hang up your connection after the successful downloading
/n - turns on the silent mode when IDM doesn't ask any questions
/a - add a file specified with /d to download queue, but don't start downloading
 
Parameters /a, /h, /n, /q, /f local_file_name,  /p local_path work only if you specified the file to download with /d URL
```

# 示例

脚本输出命令如：

```
cd "C:/Program Files (x86)/Internet Download Manager"

.\idman.exe|.\idman.exe /d "https://i.pximg.net/img-original/img/2020/07/06/12/35/18/82791400_p0.png" /f " #虚拟YouTuberの人気イラストやマンガ(投稿超过5万件） - pixiv\82791400_p0-Simao-R-18,バーチャルYouTuber,虚拟YouTuber,金髪,金发,ホロライブ,Hololive,赤井はあと,赤井心.png" /a
```

因为 IDM  添加任务很慢，用户需要等待很长时间。可以在脚本最后添加一个弹窗函数，提醒用户执行完毕。

```
function Read-MessageBoxDialog
{
$PopUpWin = new-object -comobject wscript.shell
$PopUpWin.popup("IDM script execution completed")
}
Read-MessageBoxDialog
```

**注意点：**

1. 如果文件的保存路径里（/f 参数）要建立文件夹，则路径分隔符要使用 Windows 风格的反斜线【\】。
2. 如果有多条命令需要连接起来。

3. Windows shell 单条命令长度限制：

CMD 在运行Microsoft Windows XP或更高版本的计算机上，可以在命令提示符下使用的最大字符串长度是8191个字符。这个长度对于输出数万个结果来说远远不够。而且这个长度限制对于把多条命令串联起来执行也是生效的。

PowerShell 的最大字符长度是 32,764。PowerShell 里这是单条命令的限制，只要单条命令长度没有超过限制，就可以把任意多语句串联起来执行。实测添加几万个文件也是可以的。

使用 PowerShell 的话必须先 cd 到目录里。因为路径用了双引号，直接调用不行。


# 效率

IDM 添加任务的速度比预想的要慢。经过测试每秒可以添加 7-10 个左右的任务（不同电脑会有差别），一小时大概能添加 20000 - 30000 个任务。这有些太慢了。假设有 6000 个文件，可能需要添加接近 20 分钟左右。（而且我有点怀疑任务多的话，越到后面添加越慢）

# 添加选项和说明

使用 IDM 进行下载

IDMan.exe 路径：

帮助

如果您要使用 IDM 下载本程序抓取的文件，请安装 IDM，然后在本程序内启用“使用 IDM 进行下载”的开关。

您还需要输入 IDM 可执行文件（IDMan.exe）所在的路径。默认路径可能如 `C:\Program Files (x86)\Internet Download Manager`。

如果您设置了“使用 IDM 进行下载”，本程序将不自动进行下载，而是在下载就绪时输出 IDM 下载命令。您可以执行输出的命令，将下载任务添加到 IDM 里。

使用方法：

1. 以管理员身份启动命令提示符（Cmd.exe）。您可以在开始菜单中输入 cmd 或者 Command Prompt 找到它。请确保以管理员身份启动。
2. 复制本程序输出的命令，粘贴到 Cmd 里。然后按下键盘的 Enter 执行命令。
3. 之后应该可以看到 IDM 的【主要下载队列】中添加了这些文件。注意：如果文件数量较多，可能需要等待很久。1万个文件可能会需要半小时左右才能添加完毕。
4. 点击 IDM 工具栏的【开始队列】按钮进行下载。