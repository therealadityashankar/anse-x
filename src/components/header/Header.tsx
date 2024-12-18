import { onMount } from 'solid-js'
import { scrollController, showConversationSidebar, showSettingsSidebar } from '@/stores/ui'
import ConversationHeaderInfo from './ConversationHeaderInfo'
import ConversationMessageClearButton from './ConversationMessageClearButton'
import ConversationMessageShareButton from './ConversationMessageShareButton'
import ConversationMessageSettingButton from './ConversationMessageSettingButton'

export default () => {
  onMount(() => {
    showConversationSidebar.set(false)
    showSettingsSidebar.set(false)
  })
  return (
    <header onDblClick={scrollController().scrollToTop} class="shrink-0 absolute top-0 left-0 right-0 fi justify-between border-b border-base h-14 px-4">
      <div class="fi overflow-hidden">
        <div
          class="fcc p-2 rounded-md text-xl hv-foreground"
          onClick={() => showConversationSidebar.set(true)}
        >
          <div i-carbon-menu />
        </div>
        <ConversationHeaderInfo />
      </div>
      <div class="fi gap-1 overflow-hidden">
        <ConversationMessageSettingButton />
        <ConversationMessageClearButton />
        <ConversationMessageShareButton />
        <div
          class="fcc p-2 rounded-md text-xl hv-foreground"
          onClick={() => showSettingsSidebar.set(true)}
        >
          <div i-carbon-settings />
        </div>
      </div>
    </header>
  )
}
