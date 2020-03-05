import { lang } from './Lang'

const formHtml = `<form class="settingForm">
  <p class="option" data-no="1">
  <span class="setWantPageWrap">
  <span class="has_tip settingNameStyle1 setWantPageTip1" data-tip="${lang.transl(
    '_页数'
  )}" style="margin-right: 0px;">${lang.transl(
  '_页数'
)}</span><span class="gray1" style="margin-right: 10px;"> ? </span>
  <input type="text" name="setWantPage" class="setinput_style1 blue setWantPage"
  value = '-1'
  >
  &nbsp;&nbsp;&nbsp;
  <span class="setWantPageTip2 gray1">-1 或者大于 0 的数字</span>
  </span>
  </p>
  <p class="option" data-no="2">
  <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
    '_下载作品类型的提示Center'
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
  </p>
  <p class="option" data-no="3">
  <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
    '_怎样下载多图作品'
  )}">${lang.transl('_多图下载设置')}<span class="gray1"> ? </span></span>
  <input type="radio" name="multipleImageWorks" id="multipleImageWorks1" class="need_beautify radio" value="0">
  <span class="beautify_radio"></span>
  <label for="multipleImageWorks1"> ${lang.transl('_全部下载')}&nbsp; </label>
  <input type="radio" name="multipleImageWorks" id="multipleImageWorks2" class="need_beautify radio" value="-1">
  <span class="beautify_radio"></span>
  <label for="multipleImageWorks2"> ${lang.transl('_不下载')}&nbsp; </label>
  <input type="radio" name="multipleImageWorks" id="multipleImageWorks3" class="need_beautify radio" value="1">
  <span class="beautify_radio"></span>
  <label for="multipleImageWorks3"> ${lang.transl(
    '_下载前几张图片'
  )}&nbsp; </label>
  <input type="text" name="firstFewImages" class="setinput_style1 blue" value="1">
  </p>
  <p class="option" data-no="4">
  <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
    '_动图保存格式title'
  )}">${lang.transl('_动图保存格式')}<span class="gray1"> ? </span></span>
  <input type="radio" name="ugoiraSaveAs" id="ugoiraSaveAs1" class="need_beautify radio" value="webm" checked>
  <span class="beautify_radio"></span>
  <label for="ugoiraSaveAs1"> ${lang.transl('_webmVideo')} &nbsp;</label>
  <input type="radio" name="ugoiraSaveAs" id="ugoiraSaveAs3" class="need_beautify radio" value="gif"> 
  <span class="beautify_radio"></span>
  <label for="ugoiraSaveAs3">${lang.transl('_gif')} &nbsp;</label>
  <input type="radio" name="ugoiraSaveAs" id="ugoiraSaveAs2" class="need_beautify radio" value="zip"> 
  <span class="beautify_radio"></span>
  <label for="ugoiraSaveAs2">${lang.transl('_zipFile')} &nbsp;</label>
  </p>
  <p class="option" data-no="5">
  <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
    '_设置收藏数量的提示'
  )}">${lang.transl('_设置收藏数量')}<span class="gray1"> ? </span></span>
  <input type="checkbox" name="favNumSwitch" class="need_beautify checkbox_switch" checked>
  <span class="beautify_switch"></span>
  <span class="subOptionWrap" data-show="favNumSwitch">
  <span>${lang.transl('_大于')}&nbsp;</span>
  <input type="text" name="setFavNum" class="setinput_style1 blue" value="0">
  </span>
  </p>
  <p class="option" data-no="6">
  <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
    '_只下载已收藏的提示'
  )}">${lang.transl('_只下载已收藏')}<span class="gray1"> ? </span></span>
  <input type="checkbox" name="setOnlyBmk" id="setOnlyBmk" class="need_beautify checkbox_switch"> 
  <span class="beautify_switch"></span>
  </p>
  <p class="option" data-no="7">
  <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
    '_筛选宽高的按钮Title'
  )} ${lang.transl('_筛选宽高的提示文字')}">${lang.transl(
  '_筛选宽高的按钮文字'
)}<span class="gray1"> ? </span></span>
  <input type="checkbox" name="setWHSwitch" class="need_beautify checkbox_switch">
  <span class="beautify_switch"></span>
  <span class="subOptionWrap" data-show="setWHSwitch">
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
    '_设置宽高比例Title'
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
    '_设置id范围提示'
  )}">${lang.transl(
  '_设置id范围'
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
    '_设置投稿时间提示'
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
    '_必须tag的提示文字'
  )}">${lang.transl('_必须含有tag')}<span class="gray1"> ? </span></span>
  <input type="checkbox" name="needTagSwitch" class="need_beautify checkbox_switch">
  <span class="beautify_switch"></span>
  <span class="subOptionWrap" data-show="needTagSwitch">
  <input type="text" name="needTag" class="setinput_style1 blue setinput_tag">
  </span>
  </p>
  <p class="option" data-no="12">
  <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
    '_排除tag的提示文字'
  )}">${lang.transl('_不能含有tag')}<span class="gray1"> ? </span></span>
  <input type="checkbox" name="notNeedTagSwitch" class="need_beautify checkbox_switch">
  <span class="beautify_switch"></span>
  <span class="subOptionWrap" data-show="notNeedTagSwitch">
  <input type="text" name="notNeedTag" class="setinput_style1 blue setinput_tag">
  </span>
  </p>
  <p class="option" data-no="19">
  <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
    '_多图建立目录提示'
  )}">${lang.transl('_多图建立目录')}<span class="gray1"> ? </span></span>
  <input type="checkbox" name="multipleImageDir" id="setMultipleImageDir" class="need_beautify checkbox_switch" >
  <span class="beautify_switch"></span>
  </p>
  <p class="option" data-no="15">
  <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
    '_快速下载建立文件夹提示'
  )}">${lang.transl('_快速下载建立文件夹')}<span class="gray1"> ? </span></span>
  <input type="checkbox" name="alwaysFolder" id="setAlwaysFolder" class="need_beautify checkbox_switch" >
  <span class="beautify_switch"></span>
  </p>
  <p class="option" data-no="14">
  <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
    '_添加字段名称提示'
  )}">${lang.transl('_添加字段名称')}<span class="gray1"> ? </span></span>
  <input type="checkbox" name="tagNameToFileName" id="setTagNameToFileName" class="need_beautify checkbox_switch" checked>
  <span class="beautify_switch"></span>
  &nbsp;&nbsp;&nbsp;
  <span class="showFileNameResult"> ${lang.transl('_预览文件名')}</span>
  </p>
  <p class="option" data-no="13">
  <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
    '_设置文件夹名的提示'
  )}">${lang.transl('_设置文件名')}<span class="gray1"> ? </span></span>
  <input type="text" name="userSetName" class="setinput_style1 blue fileNameRule" value="{id}">
  &nbsp;
  <select name="fileNameSelect">
    <option value="default">…</option>
    <option value="{id}">{id}</option>
    <option value="{user}">{user}</option>
    <option value="{userid}">{userid}</option>
    <option value="{title}">{title}</option>
    <option value="{p_title}">{p_title}</option>
    <option value="{tags}">{tags}</option>
    <option value="{tags_translate}">{tags_translate}</option>
    <option value="{p_tag}">{p_tag}</option>
    <option value="{type}">{type}</option>
    <option value="{bmk}">{bmk}</option>
    <option value="{rank}">{rank}</option>
    <option value="{date}">{date}</option>
    <option value="{px}">{px}</option>
    <option value="{id_num}">{id_num}</option>
    <option value="{p_num}">{p_num}</option>
    </select>
  &nbsp;&nbsp;
  <span class="showFileNameTip">？</span>
  </p>
  <p class="fileNameTip tip">
  <strong>${lang.transl('_设置文件夹名的提示').replace('<br>', '. ')}</strong>
  <br>
  <span class="blue">{id}</span>
  ${lang.transl('_命名标记id')}
  <br>
  <span class="blue">{user}</span>
  ${lang.transl('_命名标记user')}
  <br>
  <span class="blue">{userid}</span>
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
  <span class="blue">{px}</span>
  ${lang.transl('_命名标记px')}
  <br>
  <span class="blue">{id_num}</span>
  ${lang.transl('_命名标记9')}
  <br>
  <span class="blue">{p_num}</span>
  ${lang.transl('_命名标记p_num')}
  <br>
  ${lang.transl('_命名标记提醒')}
  </p>
  <p class="option" data-no="16">
  <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
    '_线程数字'
  )}">${lang.transl('_设置下载线程')}<span class="gray1"> ? </span></span>
  <input type="text" name="downloadThread" class="setinput_style1 blue" value="5">
  </p>
  <p class="option" data-no="17">
  <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
    '_快速下载的提示'
  )}">${lang.transl('_是否自动下载')}<span class="gray1"> ? </span></span>
  <input type="checkbox" name="quietDownload" id="setQuietDownload" class="need_beautify checkbox_switch" checked>
  <span class="beautify_switch"></span>
  </p>
  <p class="option" data-no="18">
  <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
    '_预览搜索结果说明'
  )}">${lang.transl('_预览搜索结果')}<span class="gray1"> ? </span></span>
  <input type="checkbox" name="previewResult" id="setPreviewResult" class="need_beautify checkbox_switch" checked>
  <span class="beautify_switch"></span>
  </p>
  <input type="hidden" name="debut" value="0">
  </form>`

export default formHtml
