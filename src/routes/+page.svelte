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
          <a href="/key-generation">{ $t("keygen")} { $t('tool') }</a> - { $t('keygen-intro') }
        </li>        
      </ul>
  
     
    </div>
  
    <style>
      .container {                
        padding: 20px;
        border: 1px solid #ccc;
        border-radius: 8px;
        background-color: #f9f9f9;
        font-family: Arial, sans-serif;
      }
  
      h1,
      h2 {        
        margin-bottom: 20px;
      }
  
      p {
        font-size: 1.1em;
        line-height: 1.6;        
      }
  
      ul {
        list-style-type: none;
        padding-left: 0;        
      }
  
      ul li {
        margin-bottom: 15px;
        font-size: 1.1em;
      }
  
      a {
        color: #3498db;
        text-decoration: none;
      }
  
      a:hover {
        text-decoration: underline;
      }
    </style>
  </body>
  