import { lang } from '../Lang'

const formHtml = `<form class="settingForm">
  <div class="tabsTitle">
    <div class="title">${lang.transl('_抓取')}</div>
    <div class="title">${lang.transl('_下载')}</div>
    <div class="title">${lang.transl('_其他')}</div>
  </div>
  <div class="tabsContnet">
    <div class="con">
      <p class="option" data-no="1">
      <span class="setWantPageWrap">
      <span class="has_tip settingNameStyle1 setWantPageTip1" data-tip="${lang.transl(
        '_页数',
      )}" style="margin-right: 0px;">${lang.transl('_页数')}</span>
      <span class="gray1" style="margin-right: 10px;"> ? </span>
      <input type="text" name="setWantPage" class="setinput_style1 blue setWantPage"
      value = '-1'>
      &nbsp;&nbsp;&nbsp;
      <span class="setWantPageTip2 gray1">-1 或者大于 0 的数字</span>
      </span>
      </p>

      <p class="option" data-no="2">
      <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
        '_下载作品类型的提示',
      )}">${lang.transl('_下载作品类型')}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="downType0" id="setWorkType0" class="need_beautify checkbox_common" checked>
      <span class="beautify_checkbox"></span>
      <label for="setWorkType0"> ${lang.transl('_插画')}&nbsp;</label>
      <input type="checkbox" name="downType1" id="setWorkType1" class="need_beautify checkbox_common" checked>
      <span class="beautify_checkbox"></span>
      <label for="setWorkType1"> ${lang.transl('_漫画')}&nbsp;</label>
      <input type="checkbox" name="downType2" id="setWorkType2" class="need_beautify checkbox_common" checked>
      <span class="beautify_checkbox"></span>
      <label for="setWorkType2"> ${lang.transl('_动图')}&nbsp;</label>
      <input type="checkbox" name="downType3" id="setWorkType3" class="need_beautify checkbox_common" checked>
      <span class="beautify_checkbox"></span>
      <label for="setWorkType3"> ${lang.transl('_小说')}&nbsp;</label>
      </p>

      <p class="option" data-no="21">
      <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
        '_下载作品类型的提示',
      )}">${lang.transl('_下载作品类型')}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="downSingleImg" id="setDownSingleImg" class="need_beautify checkbox_common" checked>
      <span class="beautify_checkbox"></span>
      <label for="setDownSingleImg"> ${lang.transl('_单图作品')}&nbsp;</label>
      <input type="checkbox" name="downMultiImg" id="setDownMultiImg" class="need_beautify checkbox_common" checked>
      <span class="beautify_checkbox"></span>
      <label for="setDownMultiImg"> ${lang.transl('_多图作品')}&nbsp;</label>
      </p>

      <p class="option" data-no="23">
      <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
        '_下载作品类型的提示',
      )}">${lang.transl('_下载作品类型')}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="downColorImg" id="setDownColorImg" class="need_beautify checkbox_common" checked>
      <span class="beautify_checkbox"></span>
      <label for="setDownColorImg"> ${lang.transl('_彩色图片')}&nbsp;</label>
      <input type="checkbox" name="downBlackWhiteImg" id="setDownBlackWhiteImg" class="need_beautify checkbox_common" checked>
      <span class="beautify_checkbox"></span>
      <label for="setDownBlackWhiteImg"> ${lang.transl(
        '_黑白图片',
      )}&nbsp;</label>
      </p>

      <p class="option" data-no="3">
      <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
        '_怎样下载多图作品',
      )}">${lang.transl('_多图下载设置')}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="firstFewImagesSwitch" class="need_beautify checkbox_switch">
      <span class="beautify_switch"></span>
      <span class="subOptionWrap" data-show="firstFewImagesSwitch">
      ${lang.transl('_下载前几张图片')}&nbsp;
      <input type="text" name="firstFewImages" class="setinput_style1 blue" value="1">
      </span>
      </p>

      <p class="option" data-no="6">
      <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
        '_只下载已收藏的提示',
      )}">${lang.transl('_只下载已收藏')}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="setOnlyBmk" id="setOnlyBmk" class="need_beautify checkbox_switch"> 
      <span class="beautify_switch"></span>
      </p>

      <p class="option" data-no="5">
      <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
        '_设置收藏数量的提示',
      )}">${lang.transl('_设置收藏数量')}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="BMKNumSwitch" class="need_beautify checkbox_switch">
      <span class="beautify_switch"></span>
      <span class="subOptionWrap" data-show="BMKNumSwitch">
      <span>${lang.transl('_最小值')}&nbsp;</span>
      <input type="text" name="BMKNumMin" class="setinput_style1 blue bmkNum" value="0">
      <span>${lang.transl('_最大值')}&nbsp;</span>
      <input type="text" name="BMKNumMax" class="setinput_style1 blue bmkNum" value="0">
      </span>
      </p>

      <p class="option" data-no="7">
      <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
        '_筛选宽高的按钮Title',
      )} ${lang.transl('_筛选宽高的提示文字')}">${lang.transl(
  '_筛选宽高的按钮文字',
)}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="setWHSwitch" class="need_beautify checkbox_switch">
      <span class="beautify_switch"></span>
      <span class="subOptionWrap" data-show="setWHSwitch">

      <input type="radio" name="widthHeightLimit" id="widthHeightLimit1" class="need_beautify radio" value=">=" checked>
      <span class="beautify_radio"></span>
      <label for="widthHeightLimit1">&gt;=&nbsp;</label>

      <input type="radio" name="widthHeightLimit" id="widthHeightLimit2" class="need_beautify radio" value="=">
      <span class="beautify_radio"></span>
      <label for="widthHeightLimit2">=&nbsp;</label>
      
      <input type="radio" name="widthHeightLimit" id="widthHeightLimit3" class="need_beautify radio" value="<=">
      <span class="beautify_radio"></span>
      <label for="widthHeightLimit3">&lt;=&nbsp;</label>

      <input type="text" name="setWidth" class="setinput_style1 blue" value="0">
      <input type="radio" name="setWidthAndOr" id="setWidth_AndOr1" class="need_beautify radio" value="&" checked>
      <span class="beautify_radio"></span>
      <label for="setWidth_AndOr1">and&nbsp;</label>
      <input type="radio" name="setWidthAndOr" id="setWidth_AndOr2" class="need_beautify radio" value="|">
      <span class="beautify_radio"></span>
      <label for="setWidth_AndOr2">or&nbsp;</label>
      <input type="text" name="setHeight" class="setinput_style1 blue" value="0">
      </span>
      </p>

      <p class="option" data-no="8">
      <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
        '_设置宽高比例Title',
      )}">${lang.transl('_设置宽高比例')}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="ratioSwitch" class="need_beautify checkbox_switch">
      <span class="beautify_switch"></span>
      <span class="subOptionWrap" data-show="ratioSwitch">
      <input type="radio" name="ratio" id="ratio1" class="need_beautify radio" value="1">
      <span class="beautify_radio"></span>
      <label for="ratio1"> ${lang.transl('_横图')}&nbsp; </label>
      <input type="radio" name="ratio" id="ratio2" class="need_beautify radio" value="2">
      <span class="beautify_radio"></span>
      <label for="ratio2"> ${lang.transl('_竖图')}&nbsp; </label>
      <input type="radio" name="ratio" id="ratio3" class="need_beautify radio" value="3">
      <span class="beautify_radio"></span>
      <label for="ratio3"> ${lang.transl('_输入宽高比')}</label>
      <input type="text" name="userRatio" class="setinput_style1 blue" value="">
      </span>
      </p>

      <p class="option" data-no="9">
      <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
        '_设置id范围提示',
      )}">${lang.transl(
  '_设置id范围',
)}&nbsp;&nbsp; <span class="gray1"> ? </span></span>
      <input type="checkbox" name="idRangeSwitch" class="need_beautify checkbox_switch">
      <span class="beautify_switch"></span>
      <span class="subOptionWrap" data-show="idRangeSwitch">
      <input type="radio" name="idRange" id="idRange1" class="need_beautify radio" value="1" checked>
      <span class="beautify_radio"></span>
      <label for="idRange1">  ${lang.transl('_大于')}&nbsp; </label>
      <input type="radio" name="idRange" id="idRange2" class="need_beautify radio" value="2">
      <span class="beautify_radio"></span>
      <label for="idRange2">  ${lang.transl('_小于')}&nbsp; </label>
      <input type="text" name="idRangeInput" class="setinput_style1 w100 blue" value="">
      </span>
      </p>

      <p class="option" data-no="10">
      <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
        '_设置投稿时间提示',
      )}">${lang.transl('_设置投稿时间')} <span class="gray1"> ? </span></span>
      <input type="checkbox" name="postDate" class="need_beautify checkbox_switch">
      <span class="beautify_switch"></span>
      <span class="subOptionWrap" data-show="postDate">
      <input type="datetime-local" name="postDateStart" placeholder="yyyy-MM-dd HH:mm" class="setinput_style1 postDate blue" value="">
      &nbsp;-&nbsp;
      <input type="datetime-local" name="postDateEnd" placeholder="yyyy-MM-dd HH:mm" class="setinput_style1 postDate blue" value="">
      </span>
      </p>

      <p class="option" data-no="11">
      <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
        '_必须tag的提示文字',
      )}">${lang.transl('_必须含有tag')}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="needTagSwitch" class="need_beautify checkbox_switch">
      <span class="beautify_switch"></span>
      <span class="subOptionWrap" data-show="needTagSwitch">
      <input type="radio" name="needTagMode" id="needTagMode1" class="need_beautify radio" value="all" checked>
      <span class="beautify_radio"></span>
      <label for="needTagMode1">  ${lang.transl('_全部')}&nbsp; </label>
      <input type="radio" name="needTagMode" id="needTagMode2" class="need_beautify radio" value="one">
      <span class="beautify_radio"></span>
      <label for="needTagMode2">  ${lang.transl('_任一')}&nbsp; </label>
      <input type="text" name="needTag" class="setinput_style1 blue setinput_tag">
      </span>
      </p>

      <p class="option" data-no="12">
      <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
        '_排除tag的提示文字',
      )}">${lang.transl('_不能含有tag')}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="notNeedTagSwitch" class="need_beautify checkbox_switch">
      <span class="beautify_switch"></span>
      <span class="subOptionWrap" data-show="notNeedTagSwitch">
      <input type="text" name="notNeedTag" class="setinput_style1 blue setinput_tag">
      </span>
      </p>

      <slot data-name="crawlBtns" class="centerWrap_btns"></slot>
    </div>
    <div class="con">
    <p class="option" data-no="13">
      <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
        '_设置文件夹名的提示',
      )}">${lang.transl('_命名规则')}<span class="gray1"> ? </span></span>
      <input type="text" name="userSetName" class="setinput_style1 blue fileNameRule" value="{id}">
      <select name="fileNameSelect">
        <option value="default">…</option>
        <option value="{id}">{id}</option>
        <option value="{user}">{user}</option>
        <option value="{user_id}">{user_id}</option>
        <option value="{title}">{title}</option>
        <option value="{p_title}">{p_title}</option>
        <option value="{tags}">{tags}</option>
        <option value="{tags_translate}">{tags_translate}</option>
        <option value="{tags_transl_only}">{tags_transl_only}</option>
        <option value="{p_tag}">{p_tag}</option>
        <option value="{type}">{type}</option>
        <option value="{bmk}">{bmk}</option>
        <option value="{rank}">{rank}</option>
        <option value="{date}">{date}</option>
        <option value="{task_date}">{task_date}</option>
        <option value="{px}">{px}</option>
        <option value="{series_title}">{series_title}</option>
        <option value="{series_order}">{series_order}</option>
        <option value="{id_num}">{id_num}</option>
        <option value="{p_num}">{p_num}</option>
        </select>
      &nbsp;
      <slot data-name="saveNamingRule" class=""></slot>
      <button class="showFileNameTip textButton" type="button">?</button>
      </p>
      <p class="fileNameTip tip">
      <strong>${lang
        .transl('_设置文件夹名的提示')
        .replace('<br>', '. ')}</strong>
      <br>
      ${lang.transl('_命名标记提醒')}
      <br>
      <span class="blue">{id}</span>
      ${lang.transl('_命名标记id')}
      <br>
      <span class="blue">{user}</span>
      ${lang.transl('_命名标记user')}
      <br>
      <span class="blue">{user_id}</span>
      ${lang.transl('_命名标记userid')}
      <br>
      <span class="blue">{title}</span>
      ${lang.transl('_命名标记title')}
      <br>
      <span class="blue">{p_title}</span>
      ${lang.transl('_文件夹标记PTitle')}
      <br>
      <span class="blue">{tags}</span>
      ${lang.transl('_命名标记tags')}
      <br>
      <span class="blue">{tags_translate}</span>
      ${lang.transl('_命名标记tags_trans')}
      <br>
      <span class="blue">{tags_transl_only}</span>
      ${lang.transl('_命名标记tags_transl_only')}
      <br>
      <span class="blue">{p_tag}</span>
      ${lang.transl('_文件夹标记PTag')}
      <br>
      <span class="blue">{type}</span>
      ${lang.transl('_命名标记type')}
      <br>
      <span class="blue">{bmk}</span>
      ${lang.transl('_命名标记bmk')}
      <br>
      <span class="blue">{rank}</span>
      ${lang.transl('_命名标记rank')}
      <br>
      <span class="blue">{date}</span>
      ${lang.transl('_命名标记date')}
      <br>
      <span class="blue">{task_date}</span>
      ${lang.transl('_命名标记taskDate')}
      <br>
      <span class="blue">{px}</span>
      ${lang.transl('_命名标记px')}
      <br>
      <span class="blue">{series_title}</span>
      ${lang.transl('_命名标记seriesTitle')}
      <br>
      <span class="blue">{series_order}</span>
      ${lang.transl('_命名标记seriesOrder')}
      <br>
      <span class="blue">{id_num}</span>
      ${lang.transl('_命名标记id_num')}
      <br>
      <span class="blue">{p_num}</span>
      ${lang.transl('_命名标记p_num')}
      </p>

      <p class="option" data-no="29">
      <span class="settingNameStyle1">${lang.transl(
        '_文件名长度限制',
      )}<span class="gray1"> </span></span>
      <input type="checkbox" name="fileNameLengthLimitSwitch" class="need_beautify checkbox_switch">
      <span class="beautify_switch"></span>
      <span class="subOptionWrap" data-show="fileNameLengthLimitSwitch">
      <input type="text" name="fileNameLengthLimit" class="setinput_style1 blue" value="200">
      </span>
      </p>

      <p class="option" data-no="14">
      <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
        '_添加字段名称提示',
      )}">${lang.transl(
  '_添加命名标记前缀',
)}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="tagNameToFileName" id="setTagNameToFileName" class="need_beautify checkbox_switch">
      <span class="beautify_switch"></span>
      </p>
      <p class="option" data-no="22">
      <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
        '_第一张图不带序号说明',
      )}">${lang.transl(
  '_第一张图不带序号',
)}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="noSerialNo" id="setNoSerialNo" class="need_beautify checkbox_switch">
      <span class="beautify_switch"></span>
      </p>
      <p class="option" data-no="19">
      <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
        '_多图建立目录提示',
      )}">${lang.transl('_多图建立目录')}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="multipleImageDir" id="setMultipleImageDir" class="need_beautify checkbox_switch" >
      <span class="beautify_switch"></span>
      <span class="subOptionWrap" data-show="multipleImageDir">
      <span>${lang.transl('_目录名使用')}</span>
      <input type="radio" name="multipleImageFolderName" id="multipleImageFolderName1" class="need_beautify radio" value="1" checked>
      <span class="beautify_radio"></span>
      <label for="multipleImageFolderName1"> ID&nbsp; </label>
      <input type="radio" name="multipleImageFolderName" id="multipleImageFolderName2" class="need_beautify radio" value="2">
      <span class="beautify_radio"></span>
      <label for="multipleImageFolderName2"> ${lang.transl(
        '_命名规则',
      )}&nbsp; </label>
      </span>
      </p>

      <p class="option" data-no="15">
      <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
        '_快速下载建立文件夹提示',
      )}">${lang.transl(
  '_快速下载建立文件夹',
)}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="alwaysFolder" id="setAlwaysFolder" class="need_beautify checkbox_switch" >
      <span class="beautify_switch"></span>
      </p>

      <slot data-name="namingBtns" class="centerWrap_btns"></slot>

      <p class="option" data-no="16">
      <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
        '_线程数字',
      )}">${lang.transl('_设置下载线程')}<span class="gray1"> ? </span></span>
      <input type="text" name="downloadThread" class="setinput_style1 blue" value="5">
      </p>

      <p class="option" data-no="17">
      <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
        '_快速下载的提示',
      )}">${lang.transl('_自动开始下载')}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="quietDownload" id="setQuietDownload" class="need_beautify checkbox_switch" checked>
      <span class="beautify_switch"></span>
      </p>

      <slot data-name="downloadArea"></slot>
      <slot data-name="progressBar"></slot>
    </div>
    
    <div class="con">

      <p class="option" data-no="4">
      <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
        '_动图保存格式title',
      )}">${lang.transl('_动图保存格式')}<span class="gray1"> ? </span></span>
      <input type="radio" name="ugoiraSaveAs" id="ugoiraSaveAs1" class="need_beautify radio" value="webm" checked>
      <span class="beautify_radio"></span>
      <label for="ugoiraSaveAs1"> ${lang.transl('_webmVideo')} &nbsp;</label>
      <input type="radio" name="ugoiraSaveAs" id="ugoiraSaveAs3" class="need_beautify radio" value="gif"> 
      <span class="beautify_radio"></span>
      <label for="ugoiraSaveAs3">${lang.transl('_gif')} &nbsp;</label>
      <input type="radio" name="ugoiraSaveAs" id="ugoiraSaveAs4" class="need_beautify radio" value="png"> 
      <span class="beautify_radio"></span>
      <label for="ugoiraSaveAs4" class="has_tip" data-tip="${lang.transl(
        '_无损',
      )}">${lang.transl('_apng')} &nbsp;</label>
      <input type="radio" name="ugoiraSaveAs" id="ugoiraSaveAs2" class="need_beautify radio" value="zip"> 
      <span class="beautify_radio"></span>
      <label for="ugoiraSaveAs2">${lang.transl('_zipFile')} &nbsp;</label>
      </p>

      <p class="option" data-no="24">
      <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
        '_同时转换多少个动图警告',
      )}">${lang.transl('_同时转换多少个动图')}</span>
      <input type="text" name="convertUgoiraThread" class="setinput_style1 blue" value="1">
      <span class="has_tip gray1" data-tip="${lang.transl(
        '_同时转换多少个动图警告',
      )}"> ${lang.transl('_提示')} </span>
      </p>

      <p class="option" data-no="26">
      <span class="settingNameStyle1">${lang.transl(
        '_小说保存格式',
      )}<span class="gray1"> &nbsp; </span></span>
      <input type="radio" name="novelSaveAs" id="novelSaveAs1" class="need_beautify radio" value="txt" checked>
      <span class="beautify_radio"></span>
      <label for="novelSaveAs1"> TXT &nbsp;</label>
      <input type="radio" name="novelSaveAs" id="novelSaveAs2" class="need_beautify radio" value="epub"> 
      <span class="beautify_radio"></span>
      <label for="novelSaveAs2"> EPUB &nbsp;</label>
      </p>
      
      <p class="option" data-no="27">
      <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
        '_在小说里保存元数据提示',
      )}">${lang.transl(
  '_在小说里保存元数据',
)}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="saveNovelMeta" class="need_beautify checkbox_switch" >
      <span class="beautify_switch"></span>
      </p>

      <p class="option" data-no="30">
      <span class="settingNameStyle1">${lang.transl('_图片尺寸')} </span>
      <input type="radio" name="imageSize" id="imageSize1" class="need_beautify radio" value="original" checked>
      <span class="beautify_radio"></span>
      <label for="imageSize1"> ${lang.transl('_原图')} </label>
      &nbsp;
      <input type="radio" name="imageSize" id="imageSize2" class="need_beautify radio" value="regular">
      <span class="beautify_radio"></span>
      <label for="imageSize2"> ${lang.transl('_普通')} </label>
      <span class="gray1">(1200*1200)</span>
      &nbsp;
      <input type="radio" name="imageSize" id="imageSize3" class="need_beautify radio" value="small">
      <span class="beautify_radio"></span>
      <label for="imageSize3"> ${lang.transl('_小图')} </label>
      <span class="gray1">(540*540)</span>
      </p>
  
      <p class="option" data-no="25">
      <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
        '_不符合要求的文件不会被保存',
      )}">
      ${lang.transl('_文件体积限制')} <span class="gray1"> ? </span></span>
      <input type="checkbox" name="sizeSwitch" class="need_beautify checkbox_switch">
      <span class="beautify_switch"></span>
      <span class="subOptionWrap" data-show="sizeSwitch">
      <input type="text" name="sizeMin" class="setinput_style1 blue" value="0">MiB
      &nbsp;-&nbsp;
      <input type="text" name="sizeMax" class="setinput_style1 blue" value="100">MiB
      </span>
      </p>

      <p class="option" data-no="28">
      <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
        '_不下载重复文件的提示',
      )}">
      ${lang.transl('_不下载重复文件')}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="deduplication" class="need_beautify checkbox_switch">
      <span class="beautify_switch"></span>
      <span class="subOptionWrap" data-show="deduplication">
      <span>&nbsp; ${lang.transl('_策略')}</span>
      <input type="radio" name="dupliStrategy" id="dupliStrategy1" class="need_beautify radio" value="strict" checked>
      <span class="beautify_radio"></span>
      <label class="has_tip" for="dupliStrategy1" data-tip="${lang.transl(
        '_严格模式说明',
      )}">${lang.transl('_严格')}</label>
      <input type="radio" name="dupliStrategy" id="dupliStrategy2" class="need_beautify radio" value="loose">
      <span class="beautify_radio"></span>
      <label class="has_tip" for="dupliStrategy2" data-tip="${lang.transl(
        '_宽松模式说明',
      )}">${lang.transl('_宽松')}</label>
      &nbsp;
      <button class="textButton gray1" type="button" id="exportDownloadRecord">${lang.transl(
        '_导出',
      )}</button>
      <button class="textButton gray1" type="button" id="importDownloadRecord">${lang.transl(
        '_导入',
      )}</button>
      <button class="textButton gray1" type="button" id="clearDownloadRecord">${lang.transl(
        '_清除',
      )}</button>
      </span>
      </p>

      <p class="option" data-no="35">
      <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
        '_用户阻止名单的说明',
      )}">${lang.transl('_用户阻止名单')}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="userBlockList" class="need_beautify checkbox_switch">
      <span class="beautify_switch"></span>
      <span class="subOptionWrap" data-show="userBlockList">
      <input type="text" name="blockList" class="setinput_style1 blue setinput_tag">
      </span>
      </p>

      <hr />
      
      <p class="option" data-no="33">
      <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
        '_下载之后收藏作品的提示',
      )}">
      ${lang.transl('_下载之后收藏作品')}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="bmkAfterDL" class="need_beautify checkbox_switch">
      <span class="beautify_switch"></span>
      </p>

      <p class="option" data-no="34">
      <span class="settingNameStyle1">${lang.transl('_收藏设置')}</span>
      
      <input type="radio" name="widthTag" id="widthTag1" class="need_beautify radio" value="1" checked>
      <span class="beautify_radio"></span>
      <label for="widthTag1">${lang.transl('_添加tag')}&nbsp;</label>
      <input type="radio" name="widthTag" id="widthTag2" class="need_beautify radio" value="-1">
      <span class="beautify_radio"></span>
      <label for="widthTag2">${lang.transl('_不添加tag')}</label>

      <span class="verticalSplit"></span>
      
      <input type="radio" name="restrict" id="restrict1" class="need_beautify radio" value="-1" checked>
      <span class="beautify_radio"></span>
      <label for="restrict1">${lang.transl('_公开')}&nbsp;</label>
      <input type="radio" name="restrict" id="restrict2" class="need_beautify radio" value="1">
      <span class="beautify_radio"></span>
      <label for="restrict2">${lang.transl('_不公开')}</label>
      </p>

      <hr />

      <p class="option" data-no="18">
      <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
        '_预览搜索结果说明',
      )}">${lang.transl('_预览搜索结果')}<span class="gray1"> ? </span></span>
      <input type="checkbox" name="previewResult" id="setPreviewResult" class="need_beautify checkbox_switch" checked>
      <span class="beautify_switch"></span>
      </p>

      <p class="option" data-no="31">
      <span class="settingNameStyle1">${lang.transl('_日期格式')}</span>
      <input type="text" name="dateFormat" class="setinput_style1 blue" style="width:250px;" value="YYYY-MM-DD">
      <button type="button" class="gray1 textButton showDateTip">${lang.transl(
        '_提示',
      )}</button>
      </p>
      <p class="dateFormatTip tip" style="display:none">
      <span>${lang.transl('_日期格式提示')}</span>
      <br>
      <span class="blue">YYYY</span> <span>2021</span>
      <br>
      <span class="blue">YY</span> <span>21</span>
      <br>
      <span class="blue">MM</span> <span>04</span>
      <br>
      <span class="blue">MMM</span> <span>Apr</span>
      <br>
      <span class="blue">MMMM</span> <span>April</span>
      <br>
      <span class="blue">DD</span> <span>30</span>
      <br>
      <span class="blue">hh</span> <span>06</span>
      <br>
      <span class="blue">mm</span> <span>40</span>
      <br>
      <span class="blue">ss</span> <span>08</span>
      <br>
      </p>

      <p class="option" data-no="36">
      <span class="settingNameStyle1">${lang.transl('_颜色主题')}</span>
      <input type="radio" name="theme" id="theme1" class="need_beautify radio" value="auto" checked>
      <span class="beautify_radio"></span>
      <label for="theme1">${lang.transl('_自动检测')}</label>
      &nbsp;
      <input type="radio" name="theme" id="theme2" class="need_beautify radio" value="white">
      <span class="beautify_radio"></span>
      <label for="theme2">White</label>
      &nbsp;
      <input type="radio" name="theme" id="theme3" class="need_beautify radio" value="dark">
      <span class="beautify_radio"></span>
      <label for="theme3">Dark</label>
      </p>

      <p class="option" data-no="32">
      <span class="settingNameStyle1">Language</span>
      <input type="radio" name="userSetLang" id="userSetLang1" class="need_beautify radio" value="-1" checked>
      <span class="beautify_radio"></span>
      <label for="userSetLang1">${lang.transl('_自动检测')}</label>
      &nbsp;
      <input type="radio" name="userSetLang" id="userSetLang2" class="need_beautify radio" value="0">
      <span class="beautify_radio"></span>
      <label for="userSetLang2">简体中文</label>
      &nbsp;
      <input type="radio" name="userSetLang" id="userSetLang3" class="need_beautify radio" value="3">
      <span class="beautify_radio"></span>
      <label for="userSetLang3">繁體中文</label>
      &nbsp;
      <input type="radio" name="userSetLang" id="userSetLang4" class="need_beautify radio" value="1">
      <span class="beautify_radio"></span>
      <label for="userSetLang4">日本語</label>
      &nbsp;
      <input type="radio" name="userSetLang" id="userSetLang5" class="need_beautify radio" value="2">
      <span class="beautify_radio"></span>
      <label for="userSetLang5">English</label>
      &nbsp;
      </p>

      <slot data-name="otherBtns" class="centerWrap_btns"></slot>
    </div>
  </div>
</form>`

export default formHtml
