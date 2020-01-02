import { lang } from './Lang'
import { EVT } from './EVT'
import { DOM } from './DOM'
import { centerPanel } from './CenterPanel'
import { InitSettings } from './InitSettings'
import { SettingsForm } from './Settings.d'

// 设置表单
class Settings {
  constructor() {
    this.form = centerPanel.useSlot('form', this.html) as SettingsForm

    this.bindEvents()

    new InitSettings(this.form)
  }

  public form: SettingsForm

  public readonly optionClass = 'option'

  private readonly html = `<form class="settingForm">
  <p class="${this.optionClass}" data-no="1">
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
  <p class="${this.optionClass}" data-no="2">
  <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
    '_下载作品类型的提示Center'
  )}">${lang.transl('_下载作品类型')}<span class="gray1"> ? </span></span>
  <label for="setWorkType0"><input type="checkbox" name="downType0" id="setWorkType0" checked> ${lang.transl(
    '_插画'
  )}&nbsp;</label>
  <label for="setWorkType1"><input type="checkbox" name="downType1" id="setWorkType1" checked> ${lang.transl(
    '_漫画'
  )}&nbsp;</label>
  <label for="setWorkType2"><input type="checkbox" name="downType2" id="setWorkType2" checked> ${lang.transl(
    '_动图'
  )}&nbsp;</label>
  </p>
  <p class="${this.optionClass}" data-no="3">
  <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
    '_怎样下载多图作品'
  )}">${lang.transl('_多图作品设置')}<span class="gray1"> ? </span></span>
  <label for="multipleImageWorks1"><input type="radio" name="multipleImageWorks" id="multipleImageWorks1" value="0"> ${lang.transl(
    '_全部下载'
  )}&nbsp; </label>
  <label for="multipleImageWorks2"><input type="radio" name="multipleImageWorks" id="multipleImageWorks2" value="-1"> ${lang.transl(
    '_不下载'
  )}&nbsp; </label>
  <label for="multipleImageWorks3"><input type="radio" name="multipleImageWorks" id="multipleImageWorks3" value="1"> ${lang.transl(
    '_下载前几张图片'
  )}&nbsp; </label>
  <input type="text" name="firstFewImages" class="setinput_style1 blue" value="1">
  </p>
  <p class="${this.optionClass}" data-no="4">
  <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
    '_动图保存格式title'
  )}">${lang.transl('_动图保存格式')}<span class="gray1"> ? </span></span>
  <label for="ugoiraSaveAs1"><input type="radio" name="ugoiraSaveAs" id="ugoiraSaveAs1" value="webm" checked> ${lang.transl(
    '_webmVideo'
  )} &nbsp;</label>
  <label for="ugoiraSaveAs3"><input type="radio" name="ugoiraSaveAs" id="ugoiraSaveAs3" value="gif"> ${lang.transl(
    '_gif'
  )} &nbsp;</label>
  <label for="ugoiraSaveAs2"><input type="radio" name="ugoiraSaveAs" id="ugoiraSaveAs2" value="zip"> ${lang.transl(
    '_zipFile'
  )} &nbsp;</label>
  </p>
  <p class="${this.optionClass}" data-no="5">
  <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
    '_筛选收藏数的提示Center'
  )}">${lang.transl('_筛选收藏数Center')}<span class="gray1"> ? </span></span>
  <label for="checkFavNum0"><input type="radio" name="checkFavNum" id="checkFavNum0" value="0" checked>  ${lang.transl(
    '_不限制'
  )}&nbsp; </label>
  <label for="checkFavNum1"><input type="radio" name="checkFavNum" id="checkFavNum1" value="1">  ${lang.transl(
    '_大于'
  )}&nbsp; </label>
  <input type="text" name="setFavNum" class="setinput_style1 blue" value="0">&nbsp;&nbsp;&nbsp;&nbsp;
  </p>
  <p class="${this.optionClass}" data-no="6">
  <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
    '_只下载已收藏的提示'
  )}">${lang.transl('_只下载已收藏')}<span class="gray1"> ? </span></span>
  <label for="setOnlyBmk"><input type="checkbox" name="setOnlyBmk" id="setOnlyBmk"> ${lang.transl(
    '_启用'
  )}</label>
  </p>
  <p class="${this.optionClass}" data-no="7">
  <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
    '_筛选宽高的按钮Title'
  )} ${lang.transl('_筛选宽高的提示文字')}">${lang.transl(
    '_筛选宽高的按钮文字'
  )}<span class="gray1"> ? </span></span>
  <input type="text" name="setWidth" class="setinput_style1 blue" value="0">
  <input type="radio" name="setWidthAndOr" id="setWidth_AndOr1" value="&" checked> <label for="setWidth_AndOr1">and&nbsp;</label>
  <input type="radio" name="setWidthAndOr" id="setWidth_AndOr2" value="|"> <label for="setWidth_AndOr2">or&nbsp;</label>
  <input type="text" name="setHeight" class="setinput_style1 blue" value="0">
  </p>
  <p class="${this.optionClass}" data-no="8">
  <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
    '_设置宽高比例Title'
  )}">${lang.transl('_设置宽高比例')}<span class="gray1"> ? </span></span>
  <label for="ratio0"><input type="radio" name="ratio" id="ratio0" value="0" checked>  ${lang.transl(
    '_不限制'
  )}&nbsp; </label>
  <label for="ratio1"><input type="radio" name="ratio" id="ratio1" value="1">  ${lang.transl(
    '_横图'
  )}&nbsp; </label>
  <label for="ratio2"><input type="radio" name="ratio" id="ratio2" value="2">  ${lang.transl(
    '_竖图'
  )}&nbsp; </label>
  <label for="ratio3"><input type="radio" name="ratio" id="ratio3" value="3">  ${lang.transl(
    '_输入宽高比'
  )}</label>
  <input type="text" name="userRatio" class="setinput_style1 blue" value="1.4">
  </p>
  <p class="${this.optionClass}" data-no="9">
  <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
    '_设置id范围提示'
  )}">${lang.transl('_设置id范围')} <span class="gray1"> ? </span></span>
  <label for="idRange0"><input type="radio" name="idRange" id="idRange0" value="0" checked>  ${lang.transl(
    '_不限制'
  )}&nbsp; </label>
  <label for="idRange1"><input type="radio" name="idRange" id="idRange1" value="1">  ${lang.transl(
    '_大于'
  )}&nbsp; </label>
  <label for="idRange2"><input type="radio" name="idRange" id="idRange2" value="2">  ${lang.transl(
    '_小于'
  )}&nbsp; </label>
  <input type="text" name="idRangeInput" class="setinput_style1 w100 blue" value="">
  </p>
  <p class="${this.optionClass}" data-no="10">
  <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
    '_设置投稿时间提示'
  )}">${lang.transl('_设置投稿时间')} <span class="gray1"> ? </span></span>
  <label for="setPostDate"><input type="checkbox" name="postDate" id="setPostDate"> ${lang.transl(
    '_启用'
  )}</label>
  <input type="datetime-local" name="postDateStart" placeholder="yyyy-MM-dd HH:mm" class="setinput_style1 postDate blue" value="">
  &nbsp;-&nbsp;
  <input type="datetime-local" name="postDateEnd" placeholder="yyyy-MM-dd HH:mm" class="setinput_style1 postDate blue" value="">
  </p>
  <p class="${this.optionClass}" data-no="11">
  <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
    '_必须tag的提示文字'
  )}">${lang.transl('_必须含有tag')}<span class="gray1"> ? </span></span>
  <input type="text" name="needTag" class="setinput_style1 blue setinput_tag">
  </p>
  <p class="${this.optionClass}" data-no="12">
  <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
    '_排除tag的提示文字'
  )}">${lang.transl('_不能含有tag')}<span class="gray1"> ? </span></span>
  <input type="text" name="notNeedTag" class="setinput_style1 blue setinput_tag">
  </p>
  <p class="${this.optionClass}" data-no="13">
  <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
    '_设置文件夹名的提示'
  )}">${lang.transl('_设置文件名')}<span class="gray1"> ? </span></span>
  <input type="text" name="userSetName" class="setinput_style1 blue fileNameRule" value="{id}">
  &nbsp;
  <select name="pageInfoSelect" id="pageInfoSelect">
  </select>
  &nbsp;
  <select name="fileNameSelect">
    <option value="default">…</option>
    <option value="{id}">{id}</option>
    <option value="{title}">{title}</option>
    <option value="{tags}">{tags}</option>
    <option value="{tags_translate}">{tags_translate}</option>
    <option value="{user}">{user}</option>
    <option value="{userid}">{userid}</option>
    <option value="{type}">{type}</option>
    <option value="{date}">{date}</option>
    <option value="{bmk}">{bmk}</option>
    <option value="{px}">{px}</option>
    <option value="{rank}">{rank}</option>
    <option value="{id_num}">{id_num}</option>
    <option value="{p_num}">{p_num}</option>
    </select>
  &nbsp;&nbsp;
  <span class="showFileNameTip">？</span>
  </p>
  <p class="fileNameTip tip">
  <strong>${lang.transl('_设置文件夹名的提示').replace('<br>', '. ')}</strong>
  <br>
  <span class="blue">{p_user}</span>
  ${lang.transl('_文件夹标记PUser')}
  <br>
  <span class="blue">{p_uid}</span>
  ${lang.transl('_文件夹标记PUid')}
  <br>
  <span class="blue">{p_tag}</span>
  ${lang.transl('_文件夹标记PTag')}
  <br>
  <span class="blue">{p_title}</span>
  ${lang.transl('_文件夹标记PTitle')}
  <br>
  <span class="blue">{id}</span>
  ${lang.transl('_命名标记1')}
  <br>
  <span class="blue">{title}</span>
  ${lang.transl('_命名标记2')}
  <br>
  <span class="blue">{tags}</span>
  ${lang.transl('_命名标记3')}
  <br>
  <span class="blue">{tags_translate}</span>
  ${lang.transl('_命名标记11')}
  <br>
  <span class="blue">{user}</span>
  ${lang.transl('_命名标记4')}
  <br>
  <span class="blue">{userid}</span>
  ${lang.transl('_命名标记6')}
  <br>
  <span class="blue">{date}</span>
  ${lang.transl('_命名标记12')}
  <br>
  <span class="blue">{type}</span>
  ${lang.transl('_命名标记14')}
  <br>
  <span class="blue">{bmk}</span>
  ${lang.transl('_命名标记8')}
  <br>
  <span class="blue">{px}</span>
  ${lang.transl('_命名标记7')}
  <br>
  <span class="blue">{id_num}</span>
  ${lang.transl('_命名标记9')}
  <br>
  <span class="blue">{p_num}</span>
  ${lang.transl('_命名标记10')}
  <br>
  <span class="blue">{rank}</span>
  ${lang.transl('_命名标记13')}
  <br>
  ${lang.transl('_命名标记提醒')}
  </p>
  <p class="${this.optionClass}" data-no="14">
  <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
    '_添加字段名称提示'
  )}">${lang.transl('_添加字段名称')}<span class="gray1"> ? </span></span>
  <label for="setTagNameToFileName"><input type="checkbox" name="tagNameToFileName" id="setTagNameToFileName" checked> ${lang.transl(
    '_启用'
  )}</label>
  &nbsp;&nbsp;&nbsp;
  <span class="showFileNameResult"> ${lang.transl('_预览文件名')}</span>
  </p>
  <p class="${this.optionClass}" data-no="15">
  <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
    '_快速下载建立文件夹提示'
  )}">${lang.transl('_快速下载建立文件夹')}<span class="gray1"> ? </span></span>
  <label for="setAlwaysFolder"><input type="checkbox" name="alwaysFolder" id="setAlwaysFolder" > ${lang.transl(
    '_启用'
  )}</label>
  </p>
  <p class="${this.optionClass}" data-no="16">
  <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
    '_线程数字'
  )}">${lang.transl('_设置下载线程')}<span class="gray1"> ? </span></span>
  <input type="text" name="downloadThread" class="setinput_style1 blue" value="5">
  </p>
  <p class="${this.optionClass}" data-no="17">
  <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
    '_快速下载的提示'
  )}">${lang.transl('_是否自动下载')}<span class="gray1"> ? </span></span>
  <label for="setQuietDownload"><input type="checkbox" name="quietDownload" id="setQuietDownload" checked> ${lang.transl(
    '_启用'
  )}</label>
  </p>
  <p class="${this.optionClass}" data-no="18">
  <span class="has_tip settingNameStyle1" data-tip="${lang.transl(
    '_预览搜索结果说明'
  )}">${lang.transl('_预览搜索结果')}<span class="gray1"> ? </span></span>
  <label for="setPreviewResult"><input type="checkbox" name="previewResult" id="setPreviewResult" checked> ${lang.transl(
    '_启用'
  )}</label>
  </p>
  <input type="hidden" name="debut" value="0">
  </form>`

  // 把下拉框的选择项插入到文本框里
  private insertValueToInput(from: HTMLSelectElement, to: HTMLInputElement) {
    from.addEventListener('change', () => {
      if (from.value !== 'default') {
        // 把选择项插入到光标位置,并设置新的光标位置
        const position = to.selectionStart!
        to.value =
          to.value.substr(0, position) +
          from.value +
          to.value.substr(position, to.value.length)
        to.selectionStart = position + from.value.length
        to.selectionEnd = position + from.value.length
        to.focus()
      }
    })
  }

  private bindEvents() {
    window.addEventListener(EVT.events.toggleForm, (event: CustomEventInit) => {
      const boolean = event.detail.data as boolean
      this.form.style.display = boolean ? 'block' : 'none'
    })

    // 预览文件名
    this.form
      .querySelector('.showFileNameResult')!
      .addEventListener('click', () => {
        EVT.fire(EVT.events.previewFileName)
      })

    // 显示命名字段提示
    this.form
      .querySelector('.showFileNameTip')!
      .addEventListener('click', () =>
        DOM.toggleEl(document.querySelector('.fileNameTip')! as HTMLDivElement)
      )

    // 输入框获得焦点时自动选择文本（文件名输入框例外）
    const centerInputs: NodeListOf<HTMLInputElement> = this.form.querySelectorAll(
      'input[type=text]'
    )
    for (const el of centerInputs) {
      if (el.name !== 'userSetName') {
        el.addEventListener('focus', function() {
          this.select()
        })
      }
    }

    // 把下拉框的选择项插入到文本框里
    this.insertValueToInput(this.form.pageInfoSelect, this.form.userSetName)
    this.insertValueToInput(this.form.fileNameSelect, this.form.userSetName)
  }

  public getSetting(name: string) {
    const input = this.form[name]
  }
}

const settings = new Settings()
const form = settings.form
const optionClass = settings.optionClass

export { form, optionClass }
