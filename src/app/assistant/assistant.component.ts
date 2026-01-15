import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { BuddyService } from '../services/buddy.service';

interface Message {
    text: string;
    sender: 'user' | 'buddy';
    timestamp: Date;
}

@Component({
    selector: 'app-assistant',
    templateUrl: './assistant.component.html',
    styleUrls: ['./assistant.component.css']
})
export class AssistantComponent implements OnInit, AfterViewChecked {
    @ViewChild('scrollMe') private myScrollContainer!: ElementRef;

    messages: Message[] = [];
    userInput: string = '';
    isTyping: boolean = false;

    constructor(private buddyService: BuddyService) { }

    ngOnInit(): void {
        // Initial welcome message
        this.messages.push({
            text: "Hi there! I'm Buddy. 🛍️ How can I help you today?",
            sender: 'buddy',
            timestamp: new Date()
        });
    }

    ngAfterViewChecked() {
        this.scrollToBottom();
    }

    scrollToBottom(): void {
        try {
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        } catch (err) { }
    }

    sendMessage() {
        if (!this.userInput.trim()) return;

        const userText = this.userInput.trim();
        this.messages.push({
            text: userText,
            sender: 'user',
            timestamp: new Date()
        });

        this.userInput = '';
        this.isTyping = true;

        // Simulate thinking delay
        setTimeout(() => {
            this.buddyService.getResponse(userText).subscribe(response => {
                this.messages.push({
                    text: response,
                    sender: 'buddy',
                    timestamp: new Date()
                });
                this.isTyping = false;
            });
        }, 800);
    }

    handleKey(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            this.sendMessage();
        }
    }
}
