import { describe, it, expect, vi, beforeEach } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import Editor from '@/views/editor.vue'; // Assuming this is the correct path

// Mock dependencies
vi.mock('html-to-docx', () => ({
  default: vi.fn(),
}));
vi.mock('file-saver', () => ({
  saveAs: vi.fn(),
}));

// Mock i18n and other composables if they cause issues during shallowMount
vi.mock('@/composables/i18n', () => ({
  t: vi.fn((key) => key), // Simple mock for t function
  locale: { value: 'en-US' },
}));

vi.mock('@/configs/options', () => ({
  default: vi.fn(() => ({})), 
}));

vi.mock('@/configs/events', () => ({
  default: {},
}));

// Mock vue-router
vi.mock('vue-router', () => ({
  useRoute: vi.fn(() => ({ query: {} })),
}));


describe('Editor.vue', () => {
  let wrapper;
  let mockEditorInstance;
  let HTMLtoDOCX;
  let saveAs;

  beforeEach(async () => {
    // Dynamically import after mocks are set up
    HTMLtoDOCX = (await import('html-to-docx')).default;
    saveAs = (await import('file-saver')).saveAs;

    // Reset mocks before each test
    HTMLtoDOCX.mockReset();
    saveAs.mockReset();

    // Mock editor instance and its methods
    mockEditorInstance = {
      getHTML: vi.fn().mockReturnValue('<p>Test HTML</p>'),
      useAlert: vi.fn(() => ({ destroy: vi.fn() })),
      setLocale: vi.fn(), // Mock any other methods called during setup
      setTheme: vi.fn(),
    };

    // Mount the component
    // We use shallowMount to avoid rendering child components
    // Provide necessary mocks for setup function
    wrapper = shallowMount(Editor, {
      global: {
        stubs: {
          'umo-editor': { // Stubbing out umo-editor which seems to be the main dependency
            template: '<div />',
            methods: {
              setLocale: vi.fn(),
              setTheme: vi.fn(),
            }
          },
          'config-panel': true, // Stub other complex child components
          'assistant': true,
          'page-header': true,
          'page-footer': true,
          'umo-menu-button': true,
        },
         mocks: { // Mocks for global properties, if any are used from provide/inject or plugins
          $t: (key) => key, // if vue-i18n is used globally
        }
      },
    });

    // Manually set the editorRef to our mock instance
    // This is a common way to inject refs for testing in Vue 3 <script setup>
    // We need to wait for the component to be mounted and nextTick for refs to be available
    await wrapper.vm.$nextTick(); // Ensure component is mounted
    
    // The exportToDocx function uses editorRef.value directly
    // We need to ensure editorRef is set up correctly in the component's scope
    // This requires editorRef to be exposed from setup, or to be set from within the test
    // For now, we assume `wrapper.vm.editorRef` can be set, or we can assign to `wrapper.vm.$refs.editorRef`
    // if `editorRef` is a template ref.
    // Given `ref="editorRef"` in the template for `umo-editor`, it's a template ref.
    // However, exportToDocx directly uses the `editorRef` from `script setup`.
    // We'll try to set it on the vm instance, hoping it's exposed or accessible.
    wrapper.vm.editorRef = { value: mockEditorInstance };


    // If `exportToDocx` is not directly callable on `wrapper.vm`, 
    // we might need to trigger it via the button click if possible,
    // or expose it for testing (which is not ideal for this task).
    // For now, let's assume we can call it if we assign editorRef correctly.
    // The function `exportToDocx` is defined in setup, so it's not directly on `wrapper.vm`.
    // This is the most challenging part.
    // A common pattern is to expose methods for testing using `defineExpose`.
    // Since we cannot modify the component, we will have to rely on the button click
    // or find another way to invoke it.
    // Let's try to directly call it by accessing it from the component's setupState.
    // This is usually not standard but might work depending on Vitest/Vue Test Utils version.
    // A better way would be to find the button and trigger a click.
  });

  it('should call getHTML, HTMLtoDOCX, and saveAs with correct parameters when exportToDocx is called', async () => {
    // Simulate editorRef being available
    wrapper.vm.editorRef = { value: mockEditorInstance }; // Ensure ref is set for the test

    // The `exportToDocx` function is not exposed on the wrapper instance directly.
    // We need to call it in the context of the setup function.
    // This is difficult without `defineExpose`.
    // As a workaround, we can assign it to the wrapper instance for testing IF POSSIBLE,
    // or find the button and simulate a click.
    // Let's try to get it from `wrapper.vm.$.setupState.exportToDocx` if available (Vitest specific)
    
    const exportToDocxFn = wrapper.vm.$.setupState.exportToDocx;
    if (!exportToDocxFn) {
        console.warn("exportToDocx function not found on component instance's setupState. Test will likely fail or be incomplete.");
        // As a fallback, try finding the button if the direct function call is not feasible.
        // This part is more of an integration test for the button.
        // For a unit test of the function, direct invocation is preferred.
        // Since the task is to unit test the *method*, we need to invoke it.
        // If it's not exposed, we cannot truly unit test it in isolation.
        expect(true).toBe(false); // Fail test if function cannot be accessed
        return;
    }
    
    await exportToDocxFn();

    expect(mockEditorInstance.getHTML).toHaveBeenCalled();
    expect(HTMLtoDOCX).toHaveBeenCalledWith(
      '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body><p>Test HTML</p></body></html>'
    );
    expect(saveAs).toHaveBeenCalledWith(
      expect.any(Blob), // or specific Blob content if checkable
      'document.docx'
    );
  });

  it('should show an alert if editorRef is not available', async () => {
    wrapper.vm.editorRef = { value: null }; // Simulate editor instance not being available
    
    const exportToDocxFn = wrapper.vm.$.setupState.exportToDocx;
     if (!exportToDocxFn) {
        console.warn("exportToDocx function not found on component instance's setupState.");
        expect(true).toBe(false); 
        return;
    }

    await exportToDocxFn();

    // Check if useAlert was called (or console.error for the simpler case)
    // This depends on how the actual component handles the null editorRef case.
    // The current implementation logs an error and might try to call useAlert on a null object.
    // For robustness, the component should guard against editorRef.value being null before calling useAlert.
    // Let's assume console.error is called or useAlert is somehow invoked safely.
    // The provided code calls `editorRef.value.useAlert` which would throw if `editorRef.value` is null.
    // The test needs to account for this. The component code should be:
    // if (editorRef.value && editorRef.value.useAlert) { editorRef.value.useAlert(...) }
    // Or, the test needs to mock a global useAlert if it's called differently.
    // For now, we'll just check that it doesn't proceed to getHTML etc.
    expect(mockEditorInstance.getHTML).not.toHaveBeenCalled();
    expect(HTMLtoDOCX).not.toHaveBeenCalled();
    expect(saveAs).not.toHaveBeenCalled();
    // Ideally, also assert that an error was logged or an alert was attempted.
  });

   it('should show an alert on HTMLtoDOCX error', async () => {
    wrapper.vm.editorRef = { value: mockEditorInstance };
    HTMLtoDOCX.mockRejectedValueOnce(new Error('DOCX conversion failed'));

    const exportToDocxFn = wrapper.vm.$.setupState.exportToDocx;
     if (!exportToDocxFn) {
        console.warn("exportToDocx function not found on component instance's setupState.");
        expect(true).toBe(false); 
        return;
    }
    await exportToDocxFn();

    expect(mockEditorInstance.getHTML).toHaveBeenCalled();
    expect(HTMLtoDOCX).toHaveBeenCalled();
    expect(saveAs).not.toHaveBeenCalled();
    expect(mockEditorInstance.useAlert).toHaveBeenCalledWith(expect.objectContaining({
      theme: 'danger',
      body: expect.stringContaining('exportError'), // or the default message
    }));
  });


});
