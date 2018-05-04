import Hypher from 'hypher';
import { UI, Settings } from 'sketch';
import availableLanguages from './languages';

const languageOptions = availableLanguages.map(language => language.id);

function choseLanguageDialog(context, title = 'Language Pattern') {
  const selection = UI.getSelectionFromUser(
    title,
    languageOptions
  );
  const value = languageOptions[selection[1]];
  Settings.setDocumentSettingForKey(context.document.documentData(), 'chosen-language', value)
}

function getSelectedTextLayers(selectedLayers) {
  const textLayers = [];
  if (selectedLayers) {
    selectedLayers.forEach(layer => {
      if (layer.stringValue && layer.setStringValue) {
        textLayers.push(layer);
      }
    });
  }
  return textLayers;
}

export function addHyphens(context) {
  if (!Settings.documentSettingForKey(context.document.documentData(), 'chosen-language')) {
    choseLanguageDialog(context);
  }

  const chosenLanguage = Settings.documentSettingForKey(context.document.documentData(), 'chosen-language');
  // const chosenLanguage = 'de';
  const language = availableLanguages.find(_language => _language.id === chosenLanguage);

  const hypher = new Hypher(language);
  const textLayers = getSelectedTextLayers(context.selection);
  textLayers.forEach(layer => {
    const hypenated = hypher.hyphenateText(layer.stringValue());
    layer.setStringValue(hypenated);
  });
  if (textLayers.length === 0) {
    UI.message('Please chose text layers to add hyphens.');
  } else if (textLayers.length === 1) {
    UI.message(`Hyphenated ${textLayers.length} layer (Language Pattern: ${language.id}).`);
  } else {
    UI.message(`Hyphenated ${textLayers.length} layers (Language Pattern: ${language.id}).`);
  }
}


export function removeHyphens(context) {
  const textLayers = getSelectedTextLayers(context.selection);

  textLayers.forEach(layer => {
    let text = layer.stringValue();
    text = text.replace(/[\u00AD]/g, '');
    layer.setStringValue(text);
  });
  if (textLayers.length === 0) {
    UI.message('Please chose text layers to remove hyphens.');
  } else {
    UI.message(`Removed hyphens from ${textLayers.length} layers`);
  }

}


export function changeLanguage(context) {
  choseLanguageDialog(context, 'Change Language Pattern');
}
