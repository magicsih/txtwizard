<script lang="ts">
	import { t } from 'svelte-i18n'
</script>

<head>
    <title>{ $t('page.title.home') }</title>
    <meta
      name="description"
      content="{ $t('page.description.home') }"
    />
  </head>
  
  <body>
    <div class="container">
      <h1>{ $t('welcome-to-txtwizard') }</h1>
  
      <p>
        { $t('txtwizard-intro') }
      </p>
  
      <h2>{ $t('our-tools') }</h2>
  
      <ul>
        <li>
          <a href="/encryption">{ $t('encryption') } { $t('tool') }</a> - { $t('encryption-intro') }
        </li>
        <li>
          <a href="/decryption">{ $t('decryption') } { $t('tool') }</a> - { $t('decryption-intro') }
        </li>
        <li>
          <a href="/encoding-decoding">{ $t('encoding') } & { $t('decoding') } { $t('tool') }</a> - { $t('encoding-intro') }
        </li>
        <li>
          <a href="/hashing">{ $t('hashing') } { $t('tool') }</a> - { $t('hashing-intro') }
        </li>
        <li>
          <a href="/compression">{ $t('compression') } { $t('tool') }</a> - { $t('compression-intro') }
        </li>
		<li>
          <a href="/key-generation">{ $t('keygen') } { $t('tool') }</a> - { $t('keygen-intro') }
        </li>
        <li>
          <a href="/qrcode">{ $t('qr-code-gen') } { $t('tool') }</a> - { $t('qr-code-gen-intro') }
        </li>
        <li>
          <a href="/currency">{ $t('currency') } { $t('tool') }</a> - { $t('currency-intro') }
        </li>
		<li>
          <a href="/text-case-converter">Text Case Converter</a> - Convert text case.
        </li>
      </ul>
    </div>
  </body>